# Generated by Django 5.1.4 on 2024-12-26 21:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0015_rename_to_event_tournament_organiser_event_artwork'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='max_spaces',
            field=models.IntegerField(default=20),
            preserve_default=False,
        ),
    ]
