import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import selenium
from selenium.webdriver.common.by import By
import undetected_chromedriver as uc
import os.path
from selenium import webdriver
import time
import os
from PIL import Image
import re
#import pinyin
from pypinyin import pinyin, lazy_pinyin, Style
import shutil
from PIL import Image

from pathlib import Path
from pandas.api.types import is_string_dtype
from bs4 import BeautifulSoup
from pandas.api.types import is_numeric_dtype
from deep_translator import (GoogleTranslator,
                             MicrosoftTranslator,
                             PonsTranslator,
                             LingueeTranslator,
                             MyMemoryTranslator,
                             YandexTranslator,
                             PapagoTranslator,
                             DeeplTranslator,
                             QcriTranslator,
                             single_detection,
                             batch_detection)

def merge():
    """
    merges 3 picture into 1 post together based on order in the folder


    1. loop over the folder to get 3 picture pair
    2. output
    :return:
    """

    counter=0
    prev=[]
    # copy image to other folder
    for (root, dirs, files) in os.walk("merge", topdown=True):
        for counter, file in enumerate(files):
            prev += [file]
            if len(prev)==3:
                #merge
                image1=Image.open(f'merge/{prev[0]}')
                image2=Image.open(f'merge/{prev[1]}')
                image3=Image.open(f'merge/{prev[2]}')
                new_image = Image.new('RGB', (3 * image1.size[0], image1.size[1]), (250, 250, 250))
                new_image.paste(image1, (image1.size[0]*0, 0))
                new_image.paste(image2, (image1.size[0]*1, 0))
                new_image.paste(image3, (image1.size[0]*2, 0))
                new_image.save(f"output/{counter}.jpg", "JPEG")
                prev = []
                print(f"created image {counter}")





if __name__ == '__main__':
    pass


