from django.db import models
from adminside.models import BooksCategory
# Create your models here.

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