# Generated by Django 5.1.4 on 2024-12-20 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0010_bestpaintedimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='bestpaintedimage',
            name='is_winner',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
