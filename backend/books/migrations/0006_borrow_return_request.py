# Generated by Django 5.1.6 on 2025-07-15 08:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0005_borrow_is_approved_alter_borrow_borrow_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='borrow',
            name='return_request',
            field=models.BooleanField(default=False),
        ),
    ]
