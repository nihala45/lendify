
from django.http import HttpResponse

def books_home(request):
    return HttpResponse("Welcome to the Books section!")