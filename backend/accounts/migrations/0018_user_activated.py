# Generated by Django 3.2.5 on 2022-02-24 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0017_alter_studentapplied_student'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='activated',
            field=models.CharField(default='0', max_length=255),
        ),
    ]
