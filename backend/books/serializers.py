from rest_framework import serializers
from .models import Book, Borrow


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    
class BorrowSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)
    category = serializers.CharField(source='book.category.name', read_only=True)
    image = serializers.ImageField(source='book.image', read_only=True)
    book_id = serializers.IntegerField(source='book.id', read_only=True)

    class Meta:
        model = Borrow
        fields = [
            'id',
            'user_email',
            'book_title',
            'book_author',
            'category',
            'image',
            'borrow_date',
            'status',
            'book_id',
        ]
