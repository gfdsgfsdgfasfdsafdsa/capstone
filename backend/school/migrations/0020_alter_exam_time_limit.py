# Generated by Django 3.2.5 on 2022-02-05 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0019_exam_time_limit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exam',
            name='time_limit',
            field=models.CharField(max_length=10, null=True),
        ),
    ]