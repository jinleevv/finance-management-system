from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, ChangePasswordSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from .models import TaxTransactionForm, BankTransactionList, DepartmentCreditLimit, AppUser
from datetime import datetime
from django.http import HttpRequest, JsonResponse, HttpResponse
from django.conf import settings
import os
import shutil
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db.models import Count, Sum
from django.db.models.functions import ExtractYear, ExtractMonth
import calendar
import re

class SessionStatus(APIView):
    permission_classes = ()
    authentication_classes = ()
    def check_sessionid_cookie_exists(self, request: HttpRequest) -> bool:
        return 'sessionid' in request.COOKIES

    def get(self, request):
        if self.check_sessionid_cookie_exists(request):
            return Response(data={ "exist": True }, status=status.HTTP_200_OK)
        else:
            return Response(data={ "exist": False }, status=status.HTTP_204_NO_CONTENT)


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            try:
                user = serializer.check_user(data)
                login(request, user)
                return  Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError:
                return Response(data={"reason": "Non existing user"}, status=status.HTTP_400_BAD_REQUEST)

class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class UpdatePassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        data = request.data
        login_data = {"email": data.get("email"), "password": data.get("old_password")}

        login_serializer = UserLoginSerializer(data=login_data)
        if login_serializer.is_valid(raise_exception=True):
            try:
                user = login_serializer.check_user(login_data)
            except ValidationError:
                return Response(data={"reason": "Non existing user"}, status=status.HTTP_400_BAD_REQUEST)        

        serializer = ChangePasswordSerializer(data=data)

        if serializer.is_valid():
            user.set_password(data.get("new_password"))
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CardTransactionUpload(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        data = request.data

        try:
            month = data['date'][5:7]

            if data['category'] == "Meeting with Business Partners" or data['category'] == "Meeting between employees":
                departmentCreditLimitSet = DepartmentCreditLimit.objects.get(department=data['department'])

                if month == "01":
                    checkOverUsage =  departmentCreditLimitSet.q1_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q1_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.january_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q1_usage += float(data['billing_amount'])
                elif month == "02":
                    checkOverUsage =  departmentCreditLimitSet.q1_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q1_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.february_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q1_usage += float(data['billing_amount'])
                elif month == "03":
                    checkOverUsage =  departmentCreditLimitSet.q1_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q1_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.march_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q1_usage += float(data['billing_amount'])
                elif month == "04":
                    checkOverUsage =  departmentCreditLimitSet.q2_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q2_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.april_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q2_usage += float(data['billing_amount'])
                elif month == "05":
                    checkOverUsage =  departmentCreditLimitSet.q2_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q2_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.may_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q2_usage += float(data['billing_amount'])
                elif month == "06":
                    checkOverUsage =  departmentCreditLimitSet.q2_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q2_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.june_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q2_usage += float(data['billing_amount'])
                elif month == "07":
                    checkOverUsage =  departmentCreditLimitSet.q3_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q3_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.july_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q3_usage += float(data['billing_amount'])
                elif month == "08":
                    checkOverUsage =  departmentCreditLimitSet.q3_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q3_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.august_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q3_usage += float(data['billing_amount'])
                elif month == "09":
                    checkOverUsage =  departmentCreditLimitSet.q3_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q3_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.september_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q3_usage += float(data['billing_amount'])
                elif month == "10":
                    checkOverUsage =  departmentCreditLimitSet.q4_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q4_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.october_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q4_usage += float(data['billing_amount'])
                elif month == "11":
                    checkOverUsage =  departmentCreditLimitSet.q4_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q4_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.november_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q4_usage += float(data['billing_amount'])
                elif month == "12":
                    checkOverUsage =  departmentCreditLimitSet.q4_usage + float(data['billing_amount'])
                    if departmentCreditLimitSet.q4_limit < checkOverUsage:
                        print("Over Used for ", data['first_name'].upper())
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.december_usage += float(data['billing_amount'])
                    departmentCreditLimitSet.q4_usage += float(data['billing_amount'])
                
                departmentCreditLimitSet.save()

            TaxTransactionForm.objects.create_transaction(
                    trans_date=data['date'],
                    billing_amount=float(data['billing_amount']),
                    tps=float(data['tps']),
                    tvq=float(data['tvq']),
                    merchant_name=data['merchant_name'],
                    category=data['category'],
                    purpose=data['purpose'],
                    first_name=data['first_name'].upper(),
                    last_name=data['last_name'].upper(),
                    img=data['file'],
                    project=data['project'],
                    attendees=data['attendees'],
                    department=data['department'],
                )
            
            return Response({'message': 'Transaction created successfully'})

        except Exception as e:
            return Response({ "message": f"error: {e}" }, status=status.HTTP_400_BAD_REQUEST)

class CardTransactionHistory(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        try:
            data = request.data

            date_from = data.get('date_from')
            date_to = data.get('date_to')

            first_name = data.get('first_name')
            last_name = data.get('last_name')

            my_data = TaxTransactionForm.objects.filter(trans_date__range=(date_from, date_to), first_name=first_name.upper(), last_name=last_name.upper()).order_by('-trans_date')
            data_list = list(my_data.values())
            
            return JsonResponse(data_list, safe=False)
        except Exception as e:
            print(e)

class EntireCardTransactionHistory(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        serializer = UserSerializer(request.user)

        first_name = serializer.data['first_name']
        last_name = serializer.data['last_name']

        my_data = TaxTransactionForm.objects.filter(first_name=first_name.upper(), last_name=last_name.upper())
        data_list = list(my_data.values())
        
        return JsonResponse(data_list, safe=False)

class EntireUserUploadedHistory(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        data = request.data

        date_from = datetime.strptime(data.get('date_from'), "%Y-%m-%d")
        date_to = datetime.strptime(data.get('date_to'), "%Y-%m-%d")

        filtered_data = TaxTransactionForm.objects.filter(trans_date__range=[date_from, date_to])

        my_data = list(filtered_data.values())

        return JsonResponse(my_data, safe=False, status=status.HTTP_200_OK)

class DownloadTransactions(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        date_from = data.get('date_from')
        date_to = data.get('date_to')
        department_info = AppUser.objects.all().values_list('first_name', 'last_name', 'department')
        department_info_names = list(department_info)

        constructions = ['Procurement', 'Construction Director' 'Contruction Operation', 'Construction', 'Production & Safety', 'Quality & Technology', 'Maintenance']
        construction_options = ['12395202-1 Construction in progress_travel(Meal)', '12395202 Construction in progress_travel expenses', '12395213 Construction in progress_entertainment expenses', '12395201-1 Construction in progress_welfare expenses_Supporting Discussion', '12395224 Construction in progress_conference expenses', '52216111 Bank charges', '12395221 Construction in progress_vehicles expenses', '52218101 Office/General Administrative Expenses']
        general_options = ['52202101 Travel(Meal)','52202101 Travel', '52212102 Selling and administrative expenses_entertainment expenses_employees', '52201123 Selling and administrative expenses, welfare expenses, supporting discussion', '52224102 Selling and administrative expenses_conference expenses_employees', '52216111 Bank charges', '52221199 Car expenses', '52218101 Office/General Administrative Expenses']
        
        try:
            return_data = []
            bank_lists = BankTransactionList.objects.filter(post_date__range=(date_from, date_to))
            transaction_lists = list(TaxTransactionForm.objects.values_list('trans_date', 'billing_amount', 'tps', 'tvq', 'merchant_name', 'category', 'purpose', 'first_name', 'last_name', 'project', 'attendees', 'department'))
            for item in bank_lists:
                try:
                    match_item = TaxTransactionForm.objects.get(trans_date=item.trans_date, billing_amount=item.billing_amount, first_name=item.first_name.upper(), last_name=item.last_name.upper())
                    match_item_tuple = tuple(getattr(match_item, field.name) for field in match_item._meta.fields)
                    match_item_tuple = match_item_tuple[1:]
                    transaction_lists.remove(match_item_tuple[:7] + match_item_tuple[8:])

                except ObjectDoesNotExist:
                    item_dict = {
                    'Trans Date': item.trans_date,
                    'Post Date': item.post_date,
                    'Merchant Name': item.merchant_name,
                    'Billing Amount': item.billing_amount,
                    'TPS(GST)': "",
                    'TVQ(QST)': "",
                    'Expense Amount': "",
                    'Purpose': "",
                    'Category': "",
                    'Account': "",
                    'Project': "",
                    'Attendees:': "",
                    'Full Name': item.first_name.upper() + " " + item.last_name.upper(),
                    'Department': "",
                    'Matched': False,
                    }
                
                    return_data.append(item_dict)

                    continue
                
                except MultipleObjectsReturned:
                    match_items = TaxTransactionForm.objects.filter(trans_date=item.trans_date, billing_amount=item.billing_amount, first_name=item.first_name.upper(), last_name=item.last_name.upper())    
                    match_item = 0
                    try:
                        for i in match_items:
                            match_item_tuple = tuple(getattr(i, field.name) for field in i._meta.fields)
                            match_item_tuple = match_item_tuple[1:]
                            try:
                                transaction_lists.remove(match_item_tuple[:7] + match_item_tuple[8:])
                                match_item = i
                                break
                            except ValueError:
                                continue
                        if match_item == 0:
                            item_dict = {
                            'Trans Date': item.trans_date,
                            'Post Date': item.post_date,
                            'Merchant Name': item.merchant_name,
                            'Billing Amount': item.billing_amount,
                            'TPS(GST)': "",
                            'TVQ(QST)': "",
                            'Expense Amount': "",
                            'Purpose': "",
                            'Category': "",
                            'Account': "",
                            'Project': "",
                            'Attendees:': "",
                            'Full Name': item.first_name.upper() + " " + item.last_name.upper(),
                            'Department': "",
                            'Matched': False,
                            }
                            return_data.append(item_dict)

                            continue

                    except ValueError:
                        continue
                
                except ValueError:
                    item_dict = {
                    'Trans Date': item.trans_date,
                    'Post Date': item.post_date,
                    'Merchant Name': item.merchant_name,
                    'Billing Amount': item.billing_amount,
                    'TPS(GST)': "",
                    'TVQ(QST)': "",
                    'Expense Amount': "",
                    'Purpose': "",
                    'Category': "",
                    'Account': "",
                    'Project': "",
                    'Attendees:': "",
                    'Full Name': item.first_name.upper() + " " + item.last_name.upper(),
                    'Department': "",
                    'Matched': False,
                    }
                
                    return_data.append(item_dict)

                    continue

                department = ""
                full_name = item.first_name.upper() + " " + item.last_name.upper()
                
                for user in department_info_names:
                    user_full_name = user[0].upper() + " " + user[1].upper()
                    if full_name == user_full_name:
                        department = user[2]
                                        
                if department in constructions:
                    if match_item.category == 'Business Trip (Meal)':
                        account = construction_options[0]
                    elif match_item.category == 'Business Trip (Hotel,Gas,Parking,Toll,Trasportation)':
                        account = construction_options[1]
                    elif match_item.category == 'Business Trip(Hotel,Food,Gas,Parking,Toll,Trasportation)':
                        account = construction_options[1]
                    elif match_item.category == 'Meeting with Business Partners':
                        account = construction_options[2]
                    elif match_item.category == 'Meeting between employees':
                            account = construction_options[3]
                    elif match_item.category == 'Business Conference, Seminar, Workshop':
                        account = construction_options[4]
                    elif match_item.category == 'Banking Fees':
                        account = construction_options[5]
                    elif match_item.category == 'Car Expenses (Gas, Maintenance, Parking, Toll)':
                        account = construction_options[6]
                    elif match_item.category == 'Office Supplies':
                        account = construction_options[7]
                    else:
                        account = ""
                else:
                    if match_item.category == 'Business Trip (Meal)':
                        account = general_options[0]
                    elif match_item.category == 'Business Trip (Hotel,Gas,Parking,Toll,Trasportation)':
                        account = general_options[1]
                    elif match_item.category == 'Business Trip(Hotel,Food,Gas,Parking,Toll,Trasportation)':
                        account = general_options[1]
                    elif match_item.category == 'Meeting with Business Partners':
                        account = general_options[2]
                    elif match_item.category == 'Meeting between employees':
                        account = general_options[3]
                    elif match_item.category == 'Business Conference, Seminar, Workshop':
                        account = general_options[4]
                    elif match_item.category == 'Banking Fees':
                        account = general_options[5]
                    elif match_item.category == 'Car Expenses (Gas, Maintenance, Parking, Toll)':
                        account = general_options[6]
                    elif match_item.category == 'Office Supplies':
                        account = construction_options[7]
                    else:
                        account = ""
                        
                item_dict = {
                    'Trans Date': item.trans_date,
                    'Post Date': item.post_date,
                    'Merchant Name': item.merchant_name,
                    'Billing Amount': item.billing_amount,
                    'TPS(GST)': match_item.tps,
                    'TVQ(QST)': match_item.tvq,
                    'Expense Amount': item.billing_amount - (match_item.tps + match_item.tvq),
                    'Purpose': match_item.purpose,
                    'Category': match_item.category,
                    'Account': account,
                    'Project': match_item.project,
                    'Attendees:': match_item.attendees,
                    'Full Name': item.first_name.upper() + " " + item.last_name.upper(),
                    'Department': match_item.department,
                    'Matched': True,
                }
                
                return_data.append(item_dict)
            
            return Response({'data': return_data})

        except Exception as e:
            return Response({ "message": f"error: {e}" })

class BankTransactionLists(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        data = request.data

        trans_date_strings = [trans_date.strip() for trans_date in data.get('trans_date').split('\n') if trans_date != ""]
        post_date_strings = [post_date.strip() for post_date in data.get('post_date').split('\n') if post_date != ""]
        amt_strings = [amt.strip().replace(",", "") for amt in data.get('billing_amount').split('\n') if amt != ""]
        merchant_strings = [merchant.strip() for merchant in data.get('merchant_name').split('\n') if merchant != ""]
        first_name_strings = [first_name.strip() for first_name in data.get('first_name').split('\n') if first_name != ""]
        last_name_strings = [last_name.strip() for last_name in data.get('last_name').split('\n') if last_name != ""]

        try:
            if len(trans_date_strings) == len(post_date_strings) == len(amt_strings) == len(merchant_strings) == len(first_name_strings) == len(last_name_strings):
                for i in range(len(trans_date_strings)):
                    BankTransactionList.objects.create_transaction(
                    trans_date=datetime.strptime(trans_date_strings[i], "%m/%d/%y"),
                    post_date=datetime.strptime(post_date_strings[i], "%m/%d/%y"),
                    billing_amount=float(amt_strings[i]),
                    merchant_name=merchant_strings[i],
                    first_name=first_name_strings[i].upper(),
                    last_name=last_name_strings[i].upper(),
                )
                
                return Response({'message': "Successfully uploaded the information" }, status=status.HTTP_200_OK)
            else:
                raise RuntimeError("The provided number of data are different")

        except Exception as e:
            return Response({ "message": f"error: {e}" }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        my_data = BankTransactionList.objects.all().values()
        data_list = list(my_data)
        
        return JsonResponse(data_list, safe=False)

class DeleteCardTransactions(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        try:
            data = request.data
            
            userDepartment = data['userDepartment']
            data = data['rowsData']
            
            for i in range(len(data)):
                trans_date = data[i]['original']['trans_date']
                billing_amount = data[i]['original']['billing_amount']
                merchant_name = data[i]['original']['merchant_name']
                category = data[i]['original']['category']
                purpose = data[i]['original']['purpose']
                first_name = data[i]['original']['first_name']
                last_name = data[i]['original']['last_name']
                department = userDepartment

                rows = TaxTransactionForm.objects.filter(trans_date=trans_date, billing_amount=billing_amount, merchant_name=merchant_name, category=category, purpose=purpose, first_name=first_name, last_name=last_name)
                
                month = trans_date[5:7]

                if category == "Meeting with Business Partners" or category == "Meeting between employees":
                    try:    
                        departmentCreditLimitSet = DepartmentCreditLimit.objects.get(department=department)
                    except Exception as e:
                        departmentCreditLimitSet = DepartmentCreditLimit.objects.create(department=department, total_limit=1000)
                    
                    if month == "01":
                        departmentCreditLimitSet.january_usage -= float(billing_amount)
                        departmentCreditLimitSet.q1_usage -= float(billing_amount)
                    elif month == "02":
                        departmentCreditLimitSet.february_usage -= float(billing_amount)
                        departmentCreditLimitSet.q1_usage -= float(billing_amount)
                    elif month == "03":
                        departmentCreditLimitSet.march_usage -= float(billing_amount)
                        departmentCreditLimitSet.q1_usage -= float(billing_amount)
                    elif month == "04":
                        departmentCreditLimitSet.april_usage -= float(billing_amount)
                        departmentCreditLimitSet.q2_usage -= float(billing_amount)
                    elif month == "05":
                        departmentCreditLimitSet.may_usage -= float(billing_amount)
                        departmentCreditLimitSet.q2_usage -= float(billing_amount)
                    elif month == "06":
                        departmentCreditLimitSet.june_usage -= float(billing_amount)
                        departmentCreditLimitSet.q2_usage -= float(billing_amount)
                    elif month == "07":
                        departmentCreditLimitSet.july_usage -= float(billing_amount)
                        departmentCreditLimitSet.q3_usage -= float(billing_amount)
                    elif month == "08":
                        departmentCreditLimitSet.august_usage -= float(billing_amount)
                        departmentCreditLimitSet.q3_usage -= float(billing_amount)
                    elif month == "09":
                        departmentCreditLimitSet.september_usage -= float(billing_amount)
                        departmentCreditLimitSet.q3_usage -= float(billing_amount)
                    elif month == "10":
                        departmentCreditLimitSet.october_usage -= float(billing_amount)
                        departmentCreditLimitSet.q4_usage -= float(billing_amount)
                    elif month == "11":
                        departmentCreditLimitSet.november_usage -= float(billing_amount)
                        departmentCreditLimitSet.q4_usage -= float(billing_amount)
                    elif month == "12":
                        departmentCreditLimitSet.december_usage -= float(billing_amount)
                        departmentCreditLimitSet.q4_usage -= float(billing_amount)
                    
                    departmentCreditLimitSet.save()

                if rows.exists():
                    file_path = 'media/' + rows.values()[0]['img']
                    if os.path.exists(file_path):
                        os.remove('media/' + rows.values()[0]['img'])
                        rows.delete()
                    else:
                        raise RuntimeError("Unable to delete the data") 

            return Response({'message': "Successfully deleted provided data" }, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({ "message": f"error: {e}" }, status=status.HTTP_400_BAD_REQUEST)

class DeleteBankTransactions(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        try:
            data = request.data
            
            for i in range(len(data)):
                trans_date = data[i]['original']['trans_date']
                post_date = data[i]['original']['post_date']
                billing_amount = data[i]['original']['billing_amount']
                merchant_name = data[i]['original']['merchant_name']
                first_name = data[i]['original']['first_name']
                last_name = data[i]['original']['last_name']

                row = BankTransactionList.objects.filter(trans_date=trans_date, post_date=post_date, billing_amount=billing_amount, merchant_name=merchant_name, first_name=first_name, last_name=last_name).first()      
                
                if row:
                    row.delete()

            return Response({'message': "Successfully deleted provided data" }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({ "message": f"error: {e}" }, status=status.HTTP_400_BAD_REQUEST)

class DownloadReciptImages(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        filenames = request.data.get('filenames')

        if not filenames:
            return JsonResponse({"error": "No filenames provided"}, status=status.HTTP_400_BAD_REQUEST)
         
        # Assuming you have a model where the filenames are stored
        files = TaxTransactionForm.objects.filter(img__in=filenames)

        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        temp_dir = os.path.join(settings.MEDIA_ROOT, f'temp_images_{current_time}')
        os.makedirs(temp_dir, exist_ok=True)

        for file in files:
            source_path = os.path.join(settings.MEDIA_ROOT, file.img.name)
            shutil.copy2(source_path, temp_dir)

        zip_file_path = shutil.make_archive(f'images_{current_time}', 'zip', temp_dir)

        # Open the zip file and read its content
        with open(zip_file_path, 'rb') as zip_file:
            zip_content = zip_file.read()

        # Return the zip file content as the response
        response = HttpResponse(zip_content, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="images.zip"'

        os.remove(zip_file_path)
        shutil.rmtree(temp_dir)

        return response
        
class MyMissingTransactionLists(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        data = request.data

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        date_from = data.get('date_from')
        date_to = data.get('date_to')

        transactions = TaxTransactionForm.objects.filter(trans_date__range=(date_from, date_to), first_name=first_name.upper(), last_name=last_name.upper())
        bank_transactions = BankTransactionList.objects.filter(trans_date__range=(date_from, date_to), first_name=first_name.upper(), last_name=last_name.upper())
        
        transaction_dicts = [{'trans_date': obj.trans_date, 'billing_amount': obj.billing_amount, 'merchant_name': obj.merchant_name, 'category':obj.category, 'purpose': obj.purpose, "tps": obj.tps, "tvq": obj.tvq, "project": obj.project, "attendees": obj.attendees, 'first_name': obj.first_name, 'last_name': obj.last_name} for obj in transactions]
        bank_transactions_dicts = [{'trans_date': obj.trans_date, 'billing_amount': obj.billing_amount, 'first_name': obj.first_name, 'last_name': obj.last_name} for obj in bank_transactions]
        
        one_to_one_missing_element = []
        for transaction_element in transaction_dicts:
            compare_element = {'trans_date': transaction_element['trans_date'], 'billing_amount': transaction_element['billing_amount'],
                                'first_name': transaction_element['first_name'], 'last_name': transaction_element['last_name']}
            if compare_element in bank_transactions_dicts:
                bank_transactions_dicts.remove(compare_element)
            else:
                one_to_one_missing_element.append(transaction_element)

        return JsonResponse(one_to_one_missing_element, safe=False)
                    
class MyMissingBankTransactionLists(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        serializer = UserSerializer(request.user)

        first_name = serializer.data['first_name']
        last_name = serializer.data['last_name']

        transactions = TaxTransactionForm.objects.filter(first_name=first_name.upper(), last_name=last_name.upper())
        bank_transactions = BankTransactionList.objects.filter(first_name=first_name.upper(), last_name=last_name.upper())
        
        transaction_dicts = [{'trans_date': obj.trans_date, 'billing_amount': obj.billing_amount, 'first_name': obj.first_name, 'last_name': obj.last_name} for obj in transactions]
        bank_transactions_dicts = [{'trans_date': obj.trans_date, 'post_date': obj.post_date, 'billing_amount': obj.billing_amount, 'merchant_name': obj.merchant_name, 'first_name': obj.first_name, 'last_name': obj.last_name} for obj in bank_transactions]
        
        one_to_one_missing_element = []
        for transaction_element in bank_transactions_dicts:
            compare_element = {'trans_date': transaction_element['trans_date'], 'billing_amount': transaction_element['billing_amount'],
                                'first_name': transaction_element['first_name'], 'last_name': transaction_element['last_name']}
            if compare_element in transaction_dicts:
                transaction_dicts.remove(compare_element)
            else:
                one_to_one_missing_element.append(transaction_element)

        return JsonResponse(one_to_one_missing_element, safe=False)
    
class MyMatchingTransactionLists(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        serializer = UserSerializer(request.user)

        first_name = serializer.data['first_name']
        last_name = serializer.data['last_name']

        try:
            bank_lists = BankTransactionList.objects.filter(first_name=first_name.upper(), last_name=last_name.upper())
            transaction_lists = list(TaxTransactionForm.objects.filter(first_name=first_name.upper(), last_name=last_name.upper()).values_list('trans_date', 'billing_amount', 'tps', 'tvq', 'merchant_name', 'category', 'purpose', 'img', 'first_name', 'last_name', 'project', 'attendees', 'department'))
            matching_elements = []

            for item in bank_lists:
                try:
                    match_item = TaxTransactionForm.objects.get(trans_date=item.trans_date, billing_amount=item.billing_amount, first_name=item.first_name.upper(), last_name=item.last_name.upper())
                    match_item_tuple = tuple(getattr(match_item, field.name) for field in match_item._meta.fields)
                    transaction_lists.remove(match_item_tuple[1:])

                except ObjectDoesNotExist:
                    continue

                except MultipleObjectsReturned:
                    match_items = TaxTransactionForm.objects.filter(trans_date=item.trans_date, billing_amount=item.billing_amount, first_name=item.first_name.upper(), last_name=item.last_name.upper())    
                    match_item = match_items[0]
                    match_item_tuple = tuple(getattr(match_item, field.name) for field in match_item._meta.fields)
                    try:
                        transaction_lists.remove(match_item_tuple)
                    except ValueError:
                        continue
                
                except ValueError:
                    continue

                element = {
                    'trans_date': item.trans_date,
                    'post_date': item.post_date,
                    'billing_amount': item.billing_amount,
                    'merchant_name': item.merchant_name,
                    'first_name': item.first_name,
                    'last_name': item.last_name,
                }
                
                matching_elements.append(element)

            return JsonResponse(matching_elements, safe=False)
                
        except Exception as e:
            return Response({'message: unable to retrieve information'}, status=status.HTTP_400_BAD_REQUEST)
    
class FilterByDates(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  

    def post(self, request):
        data = request.data

        date_from = datetime.strptime(data.get('date_from'), "%Y-%m-%d")
        date_to = datetime.strptime(data.get('date_to'), "%Y-%m-%d")
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        filtered_data = TaxTransactionForm.objects.filter(first_name=first_name.upper(), last_name=last_name.upper(), trans_date__range=[date_from, date_to])

        my_data = list(filtered_data.values())

        return JsonResponse(my_data, safe=False, status=status.HTTP_200_OK)
    
class EntireFilterByDates(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  

    def post(self, request):
        data = request.data

        date_from = datetime.strptime(data.get('date_from'), "%Y-%m-%d")
        date_to = datetime.strptime(data.get('date_to'), "%Y-%m-%d")

        filtered_data = TaxTransactionForm.objects.filter(trans_date__range=[date_from, date_to])

        my_data = list(filtered_data.values())

        return JsonResponse(my_data, safe=False, status=status.HTTP_200_OK)
    
class EntireBankFilterByDates(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  

    def post(self, request):
        data = request.data

        date_from = datetime.strptime(data.get('date_from'), "%Y-%m-%d")
        date_to = datetime.strptime(data.get('date_to'), "%Y-%m-%d")

        filtered_data = BankTransactionList.objects.filter(trans_date__range=[date_from, date_to])

        my_data = list(filtered_data.values())

        return JsonResponse(my_data, safe=False, status=status.HTTP_200_OK)
    
class ForceMatch(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  

    def post(self, request):
        try:
            data = request.data

            old_trans_date = datetime.strptime(data['user']['trans_date'], "%Y-%m-%d")
            new_trans_date = datetime.strptime(data['bank']['trans_date'], "%Y-%m-%d")
            first_name = data['user']['first_name']
            last_name = data['user']['last_name']
            billing_amount = data['user']['billing_amount']

            modify_data = TaxTransactionForm.objects.get(trans_date=old_trans_date, billing_amount=billing_amount, first_name=first_name.upper(), last_name=last_name.upper())
            modify_data.trans_date = new_trans_date
            modify_data.save()

            return Response({'message': 'Successfully Completed'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'message': f'{e}'}, status=status.HTTP_204_NO_CONTENT)

class EditTransactionInformation(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  

    def post(self, request):
        try:
            data = request.data
            
            original_data = data['original']

            new_department = data['new_department']

            original_trans_date = datetime.strptime(original_data.get('trans_date'), "%Y-%m-%d")
            original_billing_amount = original_data.get('billing_amount')
            original_merchant_name = original_data.get('merchant_name')
            original_tps = original_data.get('tps')
            original_tvq = original_data.get('tvq')
            original_first_name = original_data.get('first_name')
            original_last_name = original_data.get('last_name')

            edit_data = data['edit']

            new_trans_date = datetime.strptime(edit_data.get('trans_date'), "%Y-%m-%d")
            new_billing_amount = edit_data.get('billing_amount')
            new_category = edit_data.get('category')
            new_tps = edit_data.get('tps')
            new_tvq = edit_data.get('tvq')
            new_merchant_name = edit_data.get('merchant_name')
            new_project = edit_data.get('project')
            new_purpose = edit_data.get('purpose')
            new_attendees = edit_data.get('attendees')

            month = edit_data.get('trans_date')[5:7]

            if new_category == "Meeting with Business Partners" or new_category == "Meeting between employees":
                departmentCreditLimitSet = DepartmentCreditLimit.objects.get(department=data['department'])

                if month == "01":
                    checkOverUsage =  departmentCreditLimitSet.q1_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q1_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.january_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q1_usage += float(new_billing_amount)
                elif month == "02":
                    checkOverUsage =  departmentCreditLimitSet.q1_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q1_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.february_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q1_usage += float(new_billing_amount)
                elif month == "03":
                    checkOverUsage =  departmentCreditLimitSet.q1_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q1_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.march_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q1_usage += float(new_billing_amount)
                elif month == "04":
                    checkOverUsage =  departmentCreditLimitSet.q2_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q2_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.april_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q2_usage += float(new_billing_amount)
                elif month == "05":
                    checkOverUsage =  departmentCreditLimitSet.q2_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q2_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.may_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q2_usage += float(new_billing_amount)
                elif month == "06":
                    checkOverUsage =  departmentCreditLimitSet.q2_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q2_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.june_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q2_usage += float(new_billing_amount)
                elif month == "07":
                    checkOverUsage =  departmentCreditLimitSet.q3_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q3_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.july_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q3_usage += float(new_billing_amount)
                elif month == "08":
                    checkOverUsage =  departmentCreditLimitSet.q3_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q3_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.august_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q3_usage += float(new_billing_amount)
                elif month == "09":
                    checkOverUsage =  departmentCreditLimitSet.q3_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q3_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.september_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q3_usage += float(new_billing_amount)
                elif month == "10":
                    checkOverUsage =  departmentCreditLimitSet.q4_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q4_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.october_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q4_usage += float(new_billing_amount)
                elif month == "11":
                    checkOverUsage =  departmentCreditLimitSet.q4_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q4_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.november_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q4_usage += float(new_billing_amount)
                elif month == "12":
                    checkOverUsage =  departmentCreditLimitSet.q4_usage + float(new_billing_amount)
                    if departmentCreditLimitSet.q4_limit < checkOverUsage:
                        print("Over Used for ", original_first_name)
                        return Response({'message': 'Over used'})
                    departmentCreditLimitSet.december_usage += float(new_billing_amount)
                    departmentCreditLimitSet.q4_usage += float(new_billing_amount)
                
                departmentCreditLimitSet.save()

            modify_data = TaxTransactionForm.objects.get(trans_date=original_trans_date, billing_amount=original_billing_amount, merchant_name=original_merchant_name,
                                                        tps=original_tps, tvq=original_tvq, first_name=original_first_name.upper(), last_name=original_last_name.upper())

            modify_data.trans_date = new_trans_date
            modify_data.billing_amount = new_billing_amount
            modify_data.category = new_category
            modify_data.tps = new_tps
            modify_data.tvq = new_tvq
            modify_data.merchant_name = new_merchant_name
            modify_data.project = new_project
            modify_data.purpose = new_purpose
            modify_data.attendees = new_attendees
            modify_data.department = new_department

            modify_data.save()

            my_data = TaxTransactionForm.objects.filter(first_name=original_first_name.upper(), last_name=original_last_name.upper())
            data_list = list(my_data.values())

            return JsonResponse(data_list, safe=False, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({'message': f'{e}'}, status=status.HTTP_204_NO_CONTENT)

class StatusBankTransactions(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  

    def post(self, request):
        try:
            data = request.data
            date_from = data.get('date_from')
            date_to = data.get('date_to')

            first_name = data.get('first_name')
            last_name = data.get('last_name')

            return_data = []
            bank_lists = BankTransactionList.objects.filter(post_date__range=(date_from, date_to), first_name=first_name.upper(), last_name=last_name.upper()).order_by('-post_date')
            transaction_lists = list(TaxTransactionForm.objects.values_list('trans_date', 'billing_amount', 'tps', 'tvq', 'merchant_name', 'category', 'purpose', 'first_name', 'last_name', 'project', 'attendees', 'department'))

            for item in bank_lists:
                try:
                    match_item = TaxTransactionForm.objects.get(trans_date=item.trans_date, billing_amount=item.billing_amount, first_name=item.first_name.upper(), last_name=item.last_name.upper())
                    match_item_tuple = tuple(getattr(match_item, field.name) for field in match_item._meta.fields)
                    match_item_tuple = match_item_tuple[1:]
                    transaction_lists.remove(match_item_tuple[:7] + match_item_tuple[8:])

                except ObjectDoesNotExist:
                    item_dict = {
                    'status': 'Unmatched',
                    'trans_date': item.trans_date,
                    'post_date': item.post_date,
                    'merchant_name': item.merchant_name,
                    'billing_amount': item.billing_amount,
                    'full_name': item.first_name.upper() + " " + item.last_name.upper(),
                    }
                
                    return_data.append(item_dict)

                    continue
                
                except MultipleObjectsReturned:
                    match_items = TaxTransactionForm.objects.filter(trans_date=item.trans_date, billing_amount=item.billing_amount, first_name=item.first_name.upper(), last_name=item.last_name.upper())    
                    match_item = 0

                    try:
                        for i in match_items:
                            match_item_tuple = tuple(getattr(i, field.name) for field in i._meta.fields)
                            match_item_tuple = match_item_tuple[1:]
                            try:
                                transaction_lists.remove(match_item_tuple[:7] + match_item_tuple[8:])
                                match_item = i
                                break
                            except ValueError:
                                continue
                        if match_item == 0:
                            item_dict = {
                            'status': 'Unmatched',
                            'trans_date': item.trans_date,
                            'post_date': item.post_date,
                            'merchant_name': item.merchant_name,
                            'billing_amount': item.billing_amount,
                            'full_name': item.first_name.upper() + " " + item.last_name.upper(),
                            }
                            return_data.append(item_dict)

                            continue

                    except ValueError:
                        continue
                
                except ValueError:
                    item_dict = {
                    'status': 'Unmatched',
                    'trans_date': item.trans_date,
                    'post_date': item.post_date,
                    'merchant_name': item.merchant_name,
                    'billing_amount': item.billing_amount,
                    'full_name': item.first_name.upper() + " " + item.last_name.upper(),
                    }
                
                    return_data.append(item_dict)

                    continue


                item_dict = {
                    'status': 'Matched',
                    'trans_date': item.trans_date,
                    'post_date': item.post_date,
                    'merchant_name': item.merchant_name,
                    'billing_amount': item.billing_amount,
                    'full_name': item.first_name.upper() + " " + item.last_name.upper(),
                    }
                
                return_data.append(item_dict)

            return Response({'data': return_data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({'message': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
        
class TopCategoriesCount(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  
    def get(self, request):
        serializer = UserSerializer(request.user)

        first_name = serializer.data['first_name']
        last_name = serializer.data['last_name']

        transactions = TaxTransactionForm.objects.filter(first_name=first_name.upper(), last_name=last_name.upper())
        top_categories = (
            transactions.values('category')
            .annotate(count=Count('id'))
            .order_by('-count')[:3]
        )

        return_value = {}
        for index, entry in enumerate(top_categories):
            return_value[index] = {"category": entry['category'], 'count': entry['count']}

        return_value['total'] = TaxTransactionForm.objects.count()

        return JsonResponse(return_value, safe=False)

class DepartmentCreditCardBalance(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        department_limits = DepartmentCreditLimit.objects.all()
        
        # Serialize the data into a list of dictionaries
        return_value = [
            {
                'department': department_limit.department,
                'total_limit': department_limit.total_limit,
                'total_usage': department_limit.total_usage,
                'january_limit': department_limit.january_limit,
                'january_usage': department_limit.january_usage,
                'february_limit': department_limit.february_limit,
                'february_usage': department_limit.february_usage,
                'march_limit': department_limit.march_limit,
                'march_usage': department_limit.march_usage,
                'q1_limit': department_limit.q1_limit,
                'q1_usage': department_limit.q1_usage,
                'april_limit': department_limit.april_limit,
                'april_usage': department_limit.april_usage,
                'may_limit': department_limit.may_limit,
                'may_usage': department_limit.may_usage,
                'june_limit': department_limit.june_limit,
                'june_usage': department_limit.june_usage,
                'q2_limit': department_limit.q2_limit,
                'q2_usage': department_limit.q2_usage,
                'july_limit': department_limit.july_limit,
                'july_usage': department_limit.july_usage,
                'august_limit': department_limit.august_limit,
                'august_usage': department_limit.august_usage,
                'september_limit': department_limit.september_limit,
                'september_usage': department_limit.september_usage,
                'q3_limit': department_limit.q3_limit,
                'q3_usage': department_limit.q3_usage,
                'october_limit': department_limit.october_limit,
                'october_usage': department_limit.october_usage,
                'november_limit': department_limit.november_limit,
                'november_usage': department_limit.november_usage,
                'december_limit': department_limit.december_limit,
                'december_usage': department_limit.december_usage,
                'q4_limit': department_limit.q4_limit,
                'q4_usage': department_limit.q4_usage,
            }
            for department_limit in department_limits
        ]

        # Return the serialized data as JSON
        return JsonResponse(return_value, safe=False)

class DepartmentCreditCardLimit(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  
    def get(self, request):
        # Group by year and month, then sum billing_amount
        total_billing_amounts = TaxTransactionForm.objects.all().annotate(
            year=ExtractYear('trans_date'),
            month=ExtractMonth('trans_date'),
        ).values(
            'year', 'month', 'department', 'category'
        ).annotate(
            total_billing_amount=Sum('billing_amount')
        ).order_by('year', 'month', 'department', 'category')

        result = {}
        for entry in total_billing_amounts:
            current_year = datetime.now().year
            data_year = entry['year']
            if data_year != current_year:
                continue
            month = calendar.month_name[int(entry['month'])]
            
            if entry['department'] == "":
                continue
            if entry['category'] == "Meeting between employees" or entry['category'] == "Meeting with Business Partners":
                try:
                    try:
                        exist_month = result[entry['department']][month]
                    except Exception as e:
                        result[entry['department']][month] = 0
                    result[entry['department']][month] += entry['total_billing_amount']
                except KeyError:
                    result[entry['department']] = {}
                    result[entry['department']][month] = entry['total_billing_amount']

        for department in result:
            try:    
                department_limit = DepartmentCreditLimit.objects.get(department=department)
            except Exception as e:
                department_limit = DepartmentCreditLimit.objects.create(department=department, total_limit=1000)

            for update_month in result[department]:
                if update_month == "January":
                    department_limit.january_usage = result[department][update_month]
                    department_limit.q1_usage = department_limit.january_usage + department_limit.february_usage + department_limit.march_usage
                elif update_month == "February":
                    department_limit.february_usage = result[department][update_month]
                    department_limit.q1_usage = department_limit.january_usage + department_limit.february_usage + department_limit.march_usage
                elif update_month == "March":
                    department_limit.march_usage = result[department][update_month]
                    department_limit.q1_usage = department_limit.january_usage + department_limit.february_usage + department_limit.march_usage
                elif update_month == "April":
                    department_limit.april_usage = result[department][update_month]
                    department_limit.q2_usage = department_limit.april_usage + department_limit.may_usage + department_limit.june_usage
                elif update_month == "May":
                    department_limit.may_usage = result[department][update_month]
                    department_limit.q2_usage = department_limit.april_usage + department_limit.may_usage + department_limit.june_usage
                elif update_month == "June": 
                    department_limit.june_usage = result[department][update_month]
                    department_limit.q2_usage = department_limit.april_usage + department_limit.may_usage + department_limit.june_usage
                elif update_month == "July":
                    department_limit.july_usage = result[department][update_month]
                    department_limit.q3_usage = department_limit.july_usage + department_limit.august_usage + department_limit.september_usage
                elif update_month == "August":
                    department_limit.august_usage = result[department][update_month]
                    department_limit.q3_usage = department_limit.july_usage + department_limit.august_usage + department_limit.september_usage                    
                elif update_month == "September":
                    department_limit.september_usage = result[department][update_month]
                    department_limit.q3_usage = department_limit.july_usage + department_limit.august_usage + department_limit.september_usage
                elif update_month == "October":
                    department_limit.october_usage = result[department][update_month]
                    department_limit.q4_usage = department_limit.october_usage + department_limit.november_usage + department_limit.december_usage
                elif update_month == "November":
                    department_limit.november_usage = result[department][update_month]
                    department_limit.q4_usage = department_limit.october_usage + department_limit.november_usage + department_limit.december_usage
                elif update_month == "December":
                    department_limit.december_usage = result[department][update_month]
                    department_limit.q4_usage = department_limit.october_usage + department_limit.november_usage + department_limit.december_usage

                department_limit.save()

        department_limits = DepartmentCreditLimit.objects.all()
        
        # Serialize the data into a list of dictionaries
        return_value = [
            {
                'department': department_limit.department,
                'total_limit': department_limit.total_limit,
                'total_usage': department_limit.total_usage,
                'january_limit': department_limit.january_limit,
                'january_usage': department_limit.january_usage,
                'february_limit': department_limit.february_limit,
                'february_usage': department_limit.february_usage,
                'march_limit': department_limit.march_limit,
                'march_usage': department_limit.march_usage,
                'q1_limit': department_limit.q1_limit,
                'q1_usage': department_limit.q1_usage,
                'april_limit': department_limit.april_limit,
                'april_usage': department_limit.april_usage,
                'may_limit': department_limit.may_limit,
                'may_usage': department_limit.may_usage,
                'june_limit': department_limit.june_limit,
                'june_usage': department_limit.june_usage,
                'q2_limit': department_limit.q2_limit,
                'q2_usage': department_limit.q2_usage,
                'july_limit': department_limit.july_limit,
                'july_usage': department_limit.july_usage,
                'august_limit': department_limit.august_limit,
                'august_usage': department_limit.august_usage,
                'september_limit': department_limit.september_limit,
                'september_usage': department_limit.september_usage,
                'q3_limit': department_limit.q3_limit,
                'q3_usage': department_limit.q3_usage,
                'october_limit': department_limit.october_limit,
                'october_usage': department_limit.october_usage,
                'november_limit': department_limit.november_limit,
                'november_usage': department_limit.november_usage,
                'december_limit': department_limit.december_limit,
                'december_usage': department_limit.december_usage,
                'q4_limit': department_limit.q4_limit,
                'q4_usage': department_limit.q4_usage,
            }
            for department_limit in department_limits
        ]

        # Return the serialized data as JSON
        return JsonResponse(return_value, safe=False)

    def post(self, request):
        data = request.data
        pattern = re.compile(r'^-?\d+(\.\d+)?$')

        new_limit = data.get('limit')
        month=  data.get('month')
        department_name = data.get('department')

        try:
            if (bool(pattern.match(new_limit))):
                department_limit = DepartmentCreditLimit.objects.get(department=department_name)
            else:
                print('limit error')
                return Response({'error': 'Limit is not a number'}, status=status.HTTP_404_NOT_FOUND)
        except DepartmentCreditLimit.DoesNotExist:
            if (bool(pattern.match(new_limit))):
                DepartmentCreditLimit.objects.create(department=department_name, total_limit=float(new_limit))
                return Response({'message': 'Department limit updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

        if month == "January":
            monthsAddedLimits = float(new_limit) + department_limit.february_limit + department_limit.march_limit
            department_limit.q1_limit = monthsAddedLimits

            department_limit.january_limit = float(new_limit)
        elif month == "February":
            monthsAddedLimits = float(new_limit) + department_limit.january_limit + department_limit.march_limit
            department_limit.q1_limit = monthsAddedLimits
            
            department_limit.february_limit = float(new_limit)
            
        elif month == "March": 
            monthsAddedLimits = float(new_limit) + department_limit.february_limit + department_limit.january_limit
            department_limit.q1_limit = monthsAddedLimits
            
            department_limit.march_limit = float(new_limit)
        elif month == "April":
            monthsAddedLimits = float(new_limit) + department_limit.may_limit + department_limit.june_limit
            department_limit.q2_limit = monthsAddedLimits
            
            department_limit.april_limit = float(new_limit)
        elif month == "May":
            monthsAddedLimits = float(new_limit) + department_limit.april_limit + department_limit.june_limit
            department_limit.q2_limit = monthsAddedLimits
            
            department_limit.may_limit = float(new_limit)
        elif month == "June":
            monthsAddedLimits = float(new_limit) + department_limit.may_limit + department_limit.april_limit
            department_limit.q2_limit = monthsAddedLimits
            
            department_limit.june_limit = float(new_limit)
        elif month == "July":
            monthsAddedLimits = float(new_limit) + department_limit.august_limit + department_limit.september_limit
            department_limit.q3_limit = monthsAddedLimits
            
            department_limit.july_limit = float(new_limit)
        elif month == "August":
            monthsAddedLimits = float(new_limit) + department_limit.july_limit + department_limit.september_limit
            department_limit.q3_limit = monthsAddedLimits
            
            department_limit.august_limit = float(new_limit)
        elif month == "September":
            monthsAddedLimits = float(new_limit) + department_limit.august_limit + department_limit.july_limit
            department_limit.q3_limit = monthsAddedLimits
            
            department_limit.september_limit = float(new_limit)
        elif month == "October":
            monthsAddedLimits = float(new_limit) + department_limit.november_limit + department_limit.december_limit
            department_limit.q4_limit = monthsAddedLimits

            department_limit.october_limit = float(new_limit)
        elif month == "November":
            monthsAddedLimits = float(new_limit) + department_limit.october_limit + department_limit.december_limit
            department_limit.q4_limit = monthsAddedLimits
            
            department_limit.november_limit = float(new_limit)
        elif month == "December":
            monthsAddedLimits = float(new_limit) + department_limit.november_limit + department_limit.october_limit
            department_limit.q4_limit = monthsAddedLimits
            
            department_limit.december_limit = float(new_limit)

        department_limit.save()
        return Response({'message': 'Department limit updated successfully'}, status=status.HTTP_200_OK)
    
class UserCreditCardLimit(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  
    def post(self, request):
        data = request.data

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        date_from = data.get('date_from')
        date_to = data.get('date_to')

        my_data = TaxTransactionForm.objects.filter(trans_date__range=(date_from, date_to), first_name=first_name.upper(), last_name=last_name.upper())

        # Sum up all billing_amount from the filtered data
        total_billing_amount = my_data.aggregate(total=Sum('billing_amount'))['total']
        
        # Return or process the total_billing_amount as needed
        return JsonResponse({'total_billing_amount': total_billing_amount})
    
class ConvertContruction(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)  
    def get(self, request):
        contruction_data = TaxTransactionForm.objects.filter(department='Contruction Operation')

        for data in contruction_data:
            data.department = 'Construction'
            data.save()

        return Response(status=status.HTTP_200_OK)