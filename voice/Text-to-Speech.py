from gtts import gTTS

def generateVoice(text):
    tts = gTTS(text = text, lang="en")
    filename=text + ".mp3"
    tts.save(filename)

generateVoice("Also stretch the other side")

