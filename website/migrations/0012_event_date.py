# Generated by Django 5.1.4 on 2024-12-21 20:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0011_bestpaintedimage_is_winner'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='date',
            field=models.DateField(default=datetime.datetime(2024, 12, 21, 20, 38, 55, 367702, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
    ]
