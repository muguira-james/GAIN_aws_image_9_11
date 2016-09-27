# summarize.py
import os,sys
from gensim.summarization import summarize
from gensim.summarization import keywords

"""
 summarize and keyword a document and return them as strings

 input: absolute file path
 output: summ of summary text, keyw of keywords for the doc

 """
def summaryPlusKeywords(fileName):
    try:
        infile = fileName
        fin = open(infile, 'rb')
        text = fin.read()
        fin.close()
	text = text.decode('utf-8', 'ignore')
        summ = summarize(text, word_count=100)
        keyw = keywords(text, ratio=0.01)
        return summ, keyw
    except:
        print 'summary failed?: {}'.format(sys.exc_info()[0])
        sys.exit(1)
