# Generated by Django 2.0.7 on 2018-08-02 13:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Replies', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subject',
            old_name='category',
            new_name='categoryId',
        ),
        migrations.RenameField(
            model_name='subject',
            old_name='message',
            new_name='messageId',
        ),
        migrations.RenameField(
            model_name='subject',
            old_name='subCategory',
            new_name='subCategoryId',
        ),
    ]
