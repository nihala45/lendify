from django.db import models
from adminside.models import BooksCategory
from account.models import Users


class Book(models.Model):
    title = models.CharField(max_length=255, unique=True)
    author = models.CharField(max_length=255)      
    category = models.ForeignKey(BooksCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='books')
    available_copies = models.PositiveIntegerField(default=1)
    total_copies = models.PositiveIntegerField(default=1)
    times_read = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='book_images/', null=True, blank=True)

    def __str__(self):
        return self.title

    @property 
    def is_available(self):
        return self.available_copies > 0
    
   
    
class Borrow(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Request'),
        ('delivered', 'Delivered'),
        ('return_requested', 'Return Requested'),
        ('returned', 'Returned'),
    ]

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    book = models.ForeignKey("Book", on_delete=models.CASCADE)
    borrow_date = models.DateField(null=True, blank=True)
    delivered_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Borrow')

    def __str__(self):
        return f"{self.user} - {self.book}"

    @property
    def current_status(self):
    
        return dict(self.STATUS_CHOICES).get(self.status, "Unknown")