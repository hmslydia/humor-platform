import json
import csv
import os

joke_sub_dir = '/Users/hmslydia/Downloads/funny-jokes-database.csv'
joke_file = 'joke.csv'
joke_json = '../server/jokes2.js'

def main():
  jokes_json = []

  # Read in jokes (CSV)
  f = open( os.path.join(joke_sub_dir, joke_file) )
  with f as csvfile:
    filereader = csv.reader(csvfile)
    for row in filereader:
      num = row[0]
      category_code = row[1]
      joke_text = row[3]
      new_joke_entry = {
        'source': joke_sub_dir,
        'num': num,
        'joke_text': joke_text
      }
      if category_code == '25' or category_code == '15':
        jokes_json.append(new_joke_entry)
  
  # Write jokes to file (JSON)
  jokes_out = open(joke_json, 'w')
  jokes_out.write('jokes2 = ')
  jokes_out.write(json.dumps(jokes_json))
    

'''
def readCSV():
  jokeCSV = open('data/gold2.txt')
  jokeJSON = open('./data/goldAnswers.js', 'w')
  
  answers = []
  lineNum = 0
  for line in jokeCSV.readlines():
    
    '''
    splitLine = line.split('\t')
    if splitLine[-1] == "\r\n" or splitLine[-1] == "":
      answers.append(splitLine[:-1]) 
      #print splitLine[:-1]
    else:
      splitLine[-1] = splitLine[-1][:-2]
      #print splitLine
      answers.append(splitLine)
    ''' 
    
  fout.write(json.dumps(answers))
'''

main()