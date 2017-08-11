#! python3
# runTracker.py - Scans Google Drive for new .gpx file run tracker data and converts to JSON and posts to myJSON

# Create a .txt file which will contain a list of all new .gpx files
# Search '/Users/emilymoses/Google Drive/' for .gpx files and put the name of that file into the .txt list
# Checks to see if the file name is already in the file list .txt file
# Open .txt file and read line by line to check if it's already in the file

# Opens the new file and read it
# Create an API structure to organize how I want the text in the file to be structured
# Send the structured text to myJSON in a POST request.

# Determine the files regex and put into re.compile method
# First print out the compiled regex to make sure it matches the data needed from each file
# Structure the data in the form of the API written with dictionaries in a list

import glob, os, re

def readNewFile(file):
    readGpxFile = open(file, 'r')
    wholeGpxFile = readGpxFile.readlines()
    gpxFileAsString = ''.join(wholeGpxFile)
#    compileThisRegex = re.compile(r'put the regex here you want to use')
#    gpxFileAsString = ''.join(compileThisRegex.findall(wholeGpxFile))
#    print(gpxFileAsString)

def saveFilenameToText():
#   os.chdir('/Users/emilymoses/Google Drive/running_tracks')
#   nameOfFile = open('/Users/emilymoses/Google Drive/running_tracks/listOfFiles.txt', 'r')
    os.chdir('/Users/emilymoses/test_folder')
    nameOfFile = open('/Users/emilymoses/test_folder/listOfFiles.txt', 'r')
    readIt = nameOfFile.readlines()
    nameOfFile.close()
    for file in glob.glob('*.gpx'):
        if file + '\n' not in readIt:
#           nameOfFile = open('/Users/emilymoses/Google Drive/running_tracks/listOfFiles.txt', 'a')
            nameOfFile = open('/Users/emilymoses/test_folder/listOfFiles.txt', 'a')
            nameOfFile.write(file + '\n')
            readNewFile(file)
            print('Not in folder ', file)
        else:
            fileRegex = re.compile(r'(\d\d\d)-(\d\d\d)-(\d\d\d\d)')
            regexSearch = fileRegex.search('510-910-2924')
            numberOne, numberTwo, numberThree = regexSearch.groups()
            print('Phone number found: ' + regexSearch.group())
            print('group1 ' + numberOne)
            print('group2 ' + numberTwo)
            print('group3 ' + numberThree)
        nameOfFile.close()
saveFilenameToText()
