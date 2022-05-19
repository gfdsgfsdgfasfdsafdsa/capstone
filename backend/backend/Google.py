import pickle
import os
# from datetime import datetime
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
from googleapiclient.discovery import build
# from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from google.auth.transport.requests import Request
from backend import settings


def Create_Service(client_secret_file, api_name, api_version, *scopes):
    # print(client_secret_file, api_name, api_version, scopes, sep='-')
    CLIENT_SECRET_FILE = client_secret_file
    API_SERVICE_NAME = api_name
    API_VERSION = api_version
    SCOPES = [scope for scope in scopes[0]]
    # print(SCOPES)

    cred = None

    pickle_file = f'token_{API_SERVICE_NAME}_{API_VERSION}.pickle'
    # print(pickle_file)

    if os.path.exists(pickle_file):
        with open(pickle_file, 'rb') as token:
            cred = pickle.load(token)

    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            cred = flow.run_local_server()

        with open(pickle_file, 'wb') as token:
            pickle.dump(cred, token)

    try:
        service = build(API_SERVICE_NAME, API_VERSION, credentials=cred)
        # print(API_SERVICE_NAME, 'service created successfully')
        return service
    except Exception as e:
        # print('Unable to connect.')
        print(e)
        return None

'''
def convert_to_RFC_datetime(year=1900, month=1, day=1, hour=0, minute=0):
    dt = datetime(year, month, day, hour, minute, 0).isoformat() + 'Z'
    print(dt)
    return dt
'''


def service():
    client_secrete_file = os.path.join(settings.BASE_DIR, 'client_secret.json')
    api_service_name = 'sheets'
    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    s = Create_Service(client_secrete_file, api_service_name, 'v4', scopes)
    return s


def create_spreadsheet(name):
    body = {
        'properties': {
            'title': name
        }
    }
    file = service().spreadsheets().create(body=body).execute()
    return file['spreadsheetId']


def spreadsheet_top_insert(ss_id, string_data):
    # string data = data1, data2, data3
    body = {
        "requests": [
            {
                "insertRange": {
                    "range": {
                        "sheetId": 0,
                        "startRowIndex": 0,
                        "endRowIndex": 1
                    },
                    "shiftDimension": "ROWS"
                }
            },
            {
                "pasteData": {
                    "data": string_data,
                    "type": "PASTE_NORMAL",
                    "delimiter": ",",
                    "coordinate": {
                        "sheetId": 0,
                        "rowIndex": 0,
                    }
                }
            }
        ]
    }
    service().spreadsheets().batchUpdate(spreadsheetId=ss_id, body=body).execute()


def spreadsheet_append(ss_id, value_data):
    body = {
        'majorDimension': 'ROWS',
        'values': value_data
    }
    service().spreadsheets().values().append(
        spreadsheetId=ss_id,
        valueInputOption='USER_ENTERED',
        range='Sheet1!A1',
        body=body
    ).execute()


def spreadsheet_get_data(ss_id):
    rows = service().spreadsheets().values().get(spreadsheetId=ss_id, range='Sheet1').execute()
    return rows.get('values')


def spreadsheet_delete_row(ss_id, index, end_index):
    body = {
        "requests": [
            {
                "deleteDimension": {
                    "range": {
                        "sheetId": '0',
                        'dimension': 'ROWS',
                        'startIndex': index,
                        'endIndex': end_index,
                    }
                },
            },
        ],
    }
    service().spreadsheets().batchUpdate(spreadsheetId=ss_id, body=body).execute()
