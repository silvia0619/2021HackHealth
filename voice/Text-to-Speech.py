from gtts import gTTS

def generateVoice(text):
    tts = gTTS(text = text, lang="en")
    filename=text + ".mp3"
    tts.save(filename)

generateVoice("Full body stretch will begin. Fit your full body in the webcam.")

