from bs4 import BeautifulSoup
import pyexcel

tmp_file = "tmp.xls"          # 教务处课表

def change():
    soup = BeautifulSoup(
        open('schedule.html', encoding='utf-8'), 'lxml')  # 打开课表html

    course = dict()
    num = 1
    # 读取网页课表课的每个位置
    while True:
        if num < 4:
            course['%d%d' % (num, num + 1)] = soup.find_all(id="%d%d" %
                                                            (num, num + 1))[0].find_all('td')
            num += 2
        elif 5 <= num <= 6:
            num = 7
        elif 7 <= num <= 13:
            course['%d%d%d' % (num, num + 1, num + 2)
                   ] = soup.find_all(id='%d%d%d' % (num, num + 1, num + 2))[0].find_all('td')
            num += 4
        else:
            break

    # 读取excel文档中的课
    sheetJiaoWu = pyexcel.get_sheet(file_name=tmp_file)
    sheet = dict()
    for row in range(3, 10):
        col = 1
        while col < 14:
            tmpStr = ""
            tmp = ""
            if col < 4:
                if sheetJiaoWu[row, col] != '':
                    tmp = sheetJiaoWu[row, col]
                    tmpStr += " " + str(col)
                if sheetJiaoWu[row, col + 1] != '':
                    tmp = sheetJiaoWu[row, col + 1]
                    tmpStr += " " + str(col + 1)

                string = str(col)+str(col+1)
                try:
                    sheet[string]
                except:
                    sheet[string] = dict()
                if tmpStr != '':
                    sheet[string][row-3] = tmp + "第" + tmpStr + " 节"
                else:
                    sheet[string][row-3] = ''
                col += 2

            elif col >= 5 and col <= 6:
                col = 7

            elif col == 7:
                if sheetJiaoWu[row, col] != '':
                    tmp = sheetJiaoWu[row, col]
                    tmpStr += " " + str(col)
                if sheetJiaoWu[row, col + 1] != '':
                    tmp = sheetJiaoWu[row, col + 1]
                    tmpStr += " " + str(col + 1)
                if sheetJiaoWu[row, col + 2] != '':
                    tmp = sheetJiaoWu[row, col + 2]
                    tmpStr += " " + str(col + 2)

                string = str(col)+str(col+1)+str(col+2)
                try:
                    sheet[string]
                except:
                    sheet[string] = dict()
                if tmpStr != '':
                    sheet[string][row-3] = tmp + "第" + tmpStr + " 节"
                else:
                    sheet[string][row-3] = ''
                col = 11

            elif col == 11:
                if sheetJiaoWu[row, col] != '':
                    tmp = sheetJiaoWu[row, col]
                    tmpStr += " " + str(col)
                if sheetJiaoWu[row, col + 1] != '':
                    tmp = sheetJiaoWu[row, col + 1]
                    tmpStr += " " + str(col + 1)
                if sheetJiaoWu[row, col + 2] != '':
                    tmp = sheetJiaoWu[row, col + 2]
                    tmpStr += " " + str(col + 2)

                string = str(col)+str(col+1)+str(col+2)
                try:
                    sheet[string]
                except:
                    sheet[string] = dict()
                if tmpStr != '':
                    sheet[string][row-3] = tmp + "第" + tmpStr + " 节"
                else:
                    sheet[string][row-3] = ''
                col = 14

    # 做好映射
    html_row = ['12', '34', '789', '111213']
    # 修改html中的课
    for i in range(4):
        for j in range(7):
            if j != 6:
                course[html_row[i]][j + 1].string = sheet[html_row[i]][j]
            elif j == 6:
                course[html_row[i]][0].string = sheet[html_row[i]][j]

    # 保存新的html
    with open("schedule.html", "w", encoding='utf-8') as f:
        f.write(soup.prettify())

if __name__ == '__main__':
    change()
