#! python3
# runTracker.py - Scans Google Drive for new .gpx file run tracker data and converts to JSON and posts to myJSON

# Create a .txt file which will contain a list of all new .gpx files
# Search '/Users/emilymoses/Google Drive/' for .gpx files and put the name of that file into the .txt list
# Checks to see if the file name is already in the file list .txt file

# Opens the new file and read it
# Create an API structure to organize how I want the text in the file to be structured
# Send the structured text to myJSON in a POST request.

# master myjson file that stores all of the uris (as links) of each individual run

import glob, os, requests, json

masterUri = "https://api.myjson.com/bins/6lj7d"

def post(data):
#   { "title": "All Runs", "paths": [] }
    r = requests.post('https://api.myjson.com/bins', json = data)
    print(r.text)
    jsonDictionary = json.loads(r.text)
    return jsonDictionary["uri"]

def get(uri):
    r = requests.get(uri)
    return r.text

def put(uri, data):
    r = requests.put(uri, json = data)

def readNewFile(file):
    readGpxFile = open(file, 'r')
    lines = readGpxFile.readlines()

    data = { 'path': [] }
    singlePath = {}

    for line in lines:

            if line.find('<name>') != -1:
                startName = line.find('<name>')
                endName = line.find('T',startName)
                name = line[startName+6:endName+1]
                data["name"] = name

            if line.find('lat=') != -1:
                startLatitude = line.find('lat=')
                endLatitude = line.find('"', startLatitude)
                latitude = line[startLatitude+5:endLatitude+10]
                singlePath['latitude'] = latitude
                data['path'].append(singlePath)
            
            if line.find('lon=') != -1:
                startLongitude = line.find('lon=')
                endLongitude = line.find('"', startLongitude)
                longitude = line[startLongitude+5:endLongitude+12]
                singlePath['longitude'] = longitude
                data['path'].append(singlePath)
            
            if line.find('<ele>') != -1:
                startElevation = line.find('<ele>')
                endElevation = line.find('<', startElevation)
                elevation = line[startElevation+5:endElevation+14]
                singlePath['elevation'] = elevation
                data['path'].append(singlePath)

            if line.find('<time>') != -1:
                startTime = line.find('<time>')
                endTime = line.find('Z', startTime)
                time = line[startTime+6:endTime]
                singlePath['time'] = time
                data['path'].append(singlePath)

    uri = post(data)

    myJson = get(masterUri)
    jsonDictionary = json.loads(myJson)
    jsonDictionary["paths"].append(uri)
    put(masterUri, jsonDictionary)

def saveFilenameToText():
    os.chdir('/Users/emilymoses/Google Drive/running_tracks')
    nameOfFile = open('/Users/emilymoses/Google Drive/running_tracks/listOfFiles.txt', 'r')
#    os.chdir('/Users/emilymoses/test_folder')
#    nameOfFile = open('/Users/emilymoses/test_folder/listOfFiles.txt', 'r')
    readIt = nameOfFile.readlines()
    nameOfFile.close()
    for file in glob.glob('*.gpx'):
        if file + '\n' not in readIt:
            nameOfFile = open('/Users/emilymoses/Google Drive/running_tracks/listOfFiles.txt', 'a')
#            nameOfFile = open('/Users/emilymoses/test_folder/listOfFiles.txt', 'a')
            nameOfFile.write(file + '\n')
            readNewFile(file)
            print('Not in folder ', file)
        else:
            print('Already in folder')
        nameOfFile.close()
        
saveFilenameToText()
