# Generated by Django 3.2.5 on 2022-03-04 01:24

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0021_alter_studentapplied_datetime_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentapplied',
            name='datetime_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
