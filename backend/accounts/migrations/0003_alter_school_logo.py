# Generated by Django 3.2.5 on 2022-02-01 07:47

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20220201_1503'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school',
            name='logo',
            field=cloudinary.models.CloudinaryField(max_length=255, verbose_name='image'),
        ),
    ]
