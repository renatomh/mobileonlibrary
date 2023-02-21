# -*- coding: utf-8 -*-
"""
Script to extract translation strings from app source files, translate them
and create translation files

References:
    * https://medium.com/analytics-vidhya/how-to-translate-text-with-python-9d203139dcf5
    * https://deep-translator.readthedocs.io/en/latest/

"""

# Module to deal with json formatting
import json

# Module to access OS functions
import os

# Module for regular expression
import re

# Module for translations
from deep_translator import GoogleTranslator as Translator # $ pip install deep-translator

# Function to extract texts to be translated on a file
def extract_file_translate_texts(file_path):
    # Reading the file content
    with open(file_path) as f:
        text = f.read()
    # Defining the pattern to find the strings to be translated
    # The patterns can be:
    # * t('Text')
    # * t("Text")
    # * t(`Text`)
    translatePattern = "[ \(\{]t\([ \n]*'.*',?[ \n]*\)|[ \(\{]t\([ \n]*\".*\",?[ \n]*\)|[ \(\{]t\([ \n]*`.*`,?[ \n]*\)"

    # Finding the strings to be translated
    results = re.findall(translatePattern, text)

    # Clearing the strings for listing them
    for idx, r in enumerate(results):
        # Removing the function call
        results[idx] = r[3:-1]
        # Now, we'll also remove left and right whitespaces (if present)
        results[idx] = results[idx].lstrip()
        results[idx] = results[idx].rstrip()
        # If there's a comma (,) at the end, we also remove it
        if results[idx][-1] == ',':
            results[idx] = results[idx][:-1]
        # Finally, we remove the quotes
        results[idx] = results[idx][1:-1]

    # Removing dulicates
    results = list(set(results))

    # Returning the obtained list
    return results

# Function to create a translation dict for specified languages
def get_translation_dict(texts, src_lang='en', trg_lang='pt'):
    # Creating dicts with for translations
    translation_dict = {}

    # For each extracted string
    for idx, t in enumerate(texts):
        # If the target language is he same as the source
        if src_lang == trg_lang:
            # The translataion will be the own string
            translation_dict[t] = t
        # Otherwise, we'll have to translate it
        else:
            # Calling the translation method
            translated = Translator(
                    source=src_lang,
                    target=trg_lang
                ).translate(text=t)
            # Adding the item to the translations dict
            translation_dict[t] = translated
        # Showing the current progress
        print (f'Translation {idx+1}/{len(texts)}: {t} -> {translation_dict[t]}')

    # Returning the created dict
    return translation_dict

# Function to get list of files on a directory and its subdirectories
def get_files(root_path):
    # Creating list of files
    found_files = []

    # Running through dirs and subdirs
    for path, subdirs, files in os.walk(root_path):
        for name in files:
            found_files.append(os.path.join(path, name))

    # Returning the created list
    return found_files

# Function to read a dict object from a json file
def read_dict_from_json_file(file_path):
    # Reading the file content
    with open(file_path, encoding='utf-8') as f:
        text = f.read()

    # Trying to get a dict from the json string
    try:
        json_dict = json.loads(text)
    # If an error occurs, we return 'None'
    except Exception as e:
        print(e)
        json_dict = None

    # Returning the obtained data
    return json_dict

# Function to write a dict object from a json file
def write_dict_to_json_file(data, file_path):
    # Trying to execute the function
    try:
        # Reading the file content
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    # If an error occurs
    except Exception as e:
        print(e)

# Defining the root path to parse the files
# TODO: must be updated if this script is not in the app root folder
root_path = os.path.dirname(os.path.realpath(__file__)) + os.sep + 'src'

# Defining the source language
src_lang = 'en'

# Defining the file extensions to be verified
extensions_to_verify = ['.ts', '.tsx', '.js', '.jsx']

# Getting list of files to be parsed
files = get_files(root_path)

# Parsing all files and creating a list of translation texts
texts = []
for f in files:
    # Checking if file extension should be parsed
    if os.path.splitext(f)[1] in extensions_to_verify:
        texts.extend(extract_file_translate_texts(f))

# Removing duplicates
texts = list(set(texts))

# Getting the translations files directory
# TODO: must be updated if the directory changes
translations_directory = root_path + f'{os.sep}i18n{os.sep}translations'

# Getting the translation dicts from the json files
translation_files = get_files(translations_directory)
# TODO: must be updated if translation files are not in .json extension
translation_files = [
    tf for tf in translation_files if os.path.splitext(tf)[1] == '.json'
]

# Getting the translation dicts
translation_dicts = {}
for tf in translation_files:
    # Getting only the file name with no extension
    lang = os.path.splitext(tf)[0].split(os.sep)[-1]
    # This should be only the languge abbreviation
    translation_dicts[lang] = read_dict_from_json_file(tf)

# Now, for the first translation dict, we'll remove its keys from the obtained
# texts to be translated
# This should be done, because the translation is already present, and we won't
# need to translate it again
texts = list(filter(
    lambda text: text not in translation_dicts[src_lang].keys(), texts
))

# Now, for each language to be translated, we'll translate the remaining texts
for trg_lang in translation_dicts.keys():
    # Getting the new translation dict
    new_translations = get_translation_dict(texts, src_lang, trg_lang)
    # And updating the original translations dict
    translation_dicts[trg_lang].update(new_translations)

# Then, we'll update the translations json files wieh the updated dicts
for trg_lang in translation_dicts.keys():
    # Defining the file path for the language JSON translation file
    file_path = translations_directory + f"{os.sep}{trg_lang}.json"
    write_dict_to_json_file(
        translation_dicts[trg_lang],
        file_path
    )
