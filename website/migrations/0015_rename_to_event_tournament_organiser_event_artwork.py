# Generated by Django 5.1.4 on 2024-12-25 00:15

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0014_remove_bestpaintedimage_description_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='to',
            new_name='tournament_organiser',
        ),
        migrations.AddField(
            model_name='event',
            name='artwork',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, verbose_name='artwork'),
        ),
    ]
