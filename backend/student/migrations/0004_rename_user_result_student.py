# Generated by Django 3.2.5 on 2022-02-06 14:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0003_rename_student_result_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='result',
            old_name='user',
            new_name='student',
        ),
    ]