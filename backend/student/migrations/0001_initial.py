# Generated by Django 3.2.5 on 2022-02-06 07:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0007_student'),
    ]

    operations = [
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submitted', models.BooleanField(default=False)),
                ('date_taken', models.DateTimeField(blank=True, null=True)),
                ('date_end', models.DateTimeField(blank=True, null=True)),
                ('student', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='student_results', to='accounts.student')),
            ],
        ),
        migrations.CreateModel(
            name='ResultDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField()),
                ('subject', models.CharField(max_length=255)),
                ('result', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='result_details', to='student.result')),
            ],
        ),
        migrations.CreateModel(
            name='CourseRecommended',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.CharField(max_length=255)),
                ('result', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='result_courses', to='student.result')),
            ],
        ),
    ]