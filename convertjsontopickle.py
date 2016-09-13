import json
import pickledb

# open the file
jfile = open('journal.json', 'r+')

# load it as json
root = json.load(jfile)

# close the file
jfile.close()

# get the top level data element
data = root['data']

# data is a list.  for each element in the list we add something to the database.
db = pickledb.load('testdb', False)

db.lcreate('games')

print "\n"

for game in data:
  # we convert the value into a string using json.dumps()
  db.ladd('games', game)
  print "."

# save the database
db.dump()

