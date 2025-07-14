from rest_framework import serializers
from adminside.models import BooksCategory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BooksCategory
        fields = '__all__'