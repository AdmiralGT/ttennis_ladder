import cherrypy
import json
import pickledb
import os

DELETE_PASSWORD = "dcl1234!"

class Footy(object):

    def __init__(self):
        # initialisation
        self.db = pickledb.load("journal.db", True)

        # read the games into memory
        # self.db.lgetall("games")

    @cherrypy.expose
    def journal(self):
        # we want to read out the journal as json
        games = self.db.lgetall('games')
        return '{"data": ' + json.dumps(games) + '}'

    @cherrypy.expose
    def addgame(self, winner1="null", winner2="null", loser1="null",
                loser2="null"):
        # add a game.
        if ((winner1 != "null") & (winner2 != "null") & (loser1 != "null") &
            (loser2 != "null") & (winner1 != "") & (winner2 != "") &
            (loser1 != "") & (loser2 != "")):
            # game of doubles
            gamedef = {}
            victorlist = []
            loserlist = []
            victorlist.append(winner1)
            victorlist.append(winner2)
            loserlist.append(loser1)
            loserlist.append(loser2)

            gamedef['v'] = victorlist
            gamedef['l'] = loserlist

            print gamedef

            self.db.ladd('games', gamedef)
            # self.db.dump()
        else:
            if ((winner1 != "null") & (loser1 != "null") &
                (winner1 != "") & (loser1 != "")):

                # game of singles
                gamedef = {}
                victorlist = []
                loserlist = []
                victorlist.append(winner1)
                loserlist.append(loser1)

                gamedef['v'] = victorlist
                gamedef['l'] = loserlist

                print gamedef

                self.db.ladd('games', gamedef)
                # self.db.dump()
            else:
                print "Illegal game rejected"

        games = self.db.lgetall('games')
        return '{"data": ' + json.dumps(games) + '}'
        
    @cherrypy.expose
    def removegames(self, password):
        if password == DELETE_PASSWORD:
            entries = cherrypy.request.body.read().split(',')
            for pos in entries:
                self.db.lpop('games', int(pos))

if __name__ == '__main__':
    conf = {
        '/':
            {'tools.staticdir.on': True,
              'tools.staticdir.root': os.path.abspath(os.getcwd()),
              'tools.staticdir.dir': './'
            }
          }

    cherrypy.config.update({'server.socket_host': '0.0.0.0'})
    cherrypy.config.update({'server.socket_port': 90})

    cherrypy.quickstart(Footy(), '/', conf)
