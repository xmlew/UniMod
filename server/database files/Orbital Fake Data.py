#!/usr/bin/env python
# coding: utf-8

# In[249]:


#importing required models
import pandas as pd
import urllib.request
import json
import random
import csv


# In[184]:


fos = """Applied Mathematics
Chemistry
Computational Biology
Data Science and Analytics
Environmental Studies
Food Science and Technology
Life Sciences
Mathematics
Pharmaceutical Science
Pharmacy
Physics
Quantitative Finance (QF)
Statistics"""


# In[185]:


fass = """Chinese Language
Chinese Studies
Japanese Studies
Malay Studies
South Asian Studies
Southeast Asian Studies
English Language
English Literature
Theatre Studies
History
Philosophy
Communications and New Media
Economics
Geography
Political Science
Psychology
Social Work
Sociology"""


# In[186]:


comp = """Information Systems
Business Analytics
Computer Science
Computer Engineering
Information Security"""


# In[187]:


cds = """Architecture
Biomedical Engineering
Chemical Engineering
Civil Engineering
Electrical Engineering
Engineering Science
Environmental Engineering
Industrial Design
Industrial & Systems Engineering
Infrastracture & Project Management
Landscape Architecture
Materials Science & Engineering
Mechanical Engineering"""


# In[188]:


biz = """Business Administration
Real Estate"""


# In[209]:


fosList = fos.split('\n')
fassList = fass.split('\n')
compList = comp.split('\n')
cdsList = cds.split('\n')
bizList = biz.split('\n')
musicList = ['music']


# In[270]:


contents = urllib.request.urlopen("https://api.nusmods.com/v2/2022-2023/moduleList.json")
data = json.loads(contents.read().decode())


# In[191]:


geMods = []
for d in data:
    if d['moduleCode'].startswith('GE') & (d['moduleCode'][2] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
        geMods.append(f"{d['moduleCode']}: {d['title']}")


# In[192]:


#need to do GE mod data analysis but can convert to javascript


# In[193]:


geModsNew = list(filter(lambda x: (x[2] in "ACHIN" or x[2:4] == "SS"), geMods))


# In[224]:


#this is where the dummy data will be created
fosModsList = [
    #1 GE per sem
    #Applied Math
    [['MA1100', 'MA1101R','MA1102R','CS1010E','CS1010S'], ['MA2101', 'MA2104', 'MA2108', 'MA2213', 'MA2216', 'MA2214']]
    
    
]

socModsList = [
    #1 GE per sem
    #InfoSys
    [['CS1010J', 'BT1101', 'IS1103', 'MA1521', 'ST2334'], ['BT2102', 'CS2030', 'CS2040', 'IS2101', 'IS2102', 'IS2103']],
    #BZA
    [['BT1101', 'CS1010S', 'MA2001', 'IS1103', 'MA1521'], ['BT2102', 'BT2101', 'BT2103', 'CS2030', 'CS2040', 'IS2101']],
    #comsci
    [['CS1101S', 'ES2660', 'IS1103', 'CS1231S', 'MA1521'], ['CS2030S', 'CS2040S', 'MA2001', 'CS2100', 'CS2101', 'CS2106']],
    #comeng
    [['CS1010', 'MA1511', 'MA1512', 'CG1111A', 'CS1231', 'MA1508E'], ['CG2111A', 'CS2040C', 'CG2023', 'CG2028', 'CG2271', 'CS2113']],
    #InfoSec
    [['CS1010', 'IS1103', 'CS1231S', 'MA1521', 'MA2001'], ['CS2100', 'CS2040C', 'CS2105', 'CS2106', 'CS2101']]
]

bizModsList = [
    #bizad
    [['MNO1706X', 'ACC1701X', 'MKT1705X', 'BSP1702X', 'BSP1703X', 'DAO1704X'],['FIN2704X', ]],
    #realestate
    [[],[]]
]

#basket 1 and 2, the rest is own modules
chsMods = [['HSH1000', 'HSA1000', 'GEA1000'], ['HSS1000', 'HSI1000', 'DTK1234']]


# In[244]:


#Fake Data Generator
#current implementations: create 4 core and 1 GE for everything but CHS
#currently it's all core mods cause GE implementation is a BIT mafan
def yearOnePlanner(course: str, d: dict) -> list:
    sem1, sem2 = [], []
    modules = d[course]
    while len(sem1) < 5:
        num = random.randint(0, len(d[course][0]) - 1)
        if d[course][0][num] not in sem1:
            sem1.append(d[course][0][num])
    while len(sem2) < 5:
        num2 = random.randint(0, len(d[course][1]) - 1)
        if d[course][1][num2] not in sem2:
            sem2.append(d[course][1][num2])
    return [sem1, sem2]

#Generates students
def generateStudent(course: str, d: dict) -> dict:
    sem1, sem2 = yearOnePlanner(course, d)
    return {'Course': course, 'Sem1': sem1, 'Sem2': sem2}

#Generates computing cohort
def generateCohort(faculty: list, d: dict, students: int) -> list:
    cohort = []
    for i in range(students):
        for course in faculty:
            student = generateStudent(course, d)
            cohort.append(student)
    return cohort

#will implement later. Based on the two baskets
def yearOnePlannerCHS(course: str, d: dict) -> list:
    pass


# In[237]:


compDict = {compList[i]: socModsList[i] for i in range(len(compList))}


# In[238]:


print(yearOnePlanner('Computer Science', compDict))


# In[239]:


print(generateStudent('Business Analytics', compDict))


# In[245]:


computingCohort = generateCohort(compList, compDict, 500)


# In[246]:


len(computingCohort)


# In[273]:


#writer = csv.DictWriter("fakedata.csv", fieldnames=['Course', 'Sem1', 'Sem2'])

try:
    with open("fakedata.csv", 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=['Course', 'Sem1', 'Sem2'])
        writer.writeheader()
        for i in computingCohort:
            writer.writerow(i)
except IOError:
    print("I/O error")


# In[276]:


try:
    with open("moduleData.csv", 'w', encoding = 'utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=['moduleCode', 'title', 'semesters'])
        writer.writeheader()
        for i in data:
            print(i)
            writer.writerow(i)
except IOError:
    print("I/O error")


# In[ ]:





# In[ ]:




