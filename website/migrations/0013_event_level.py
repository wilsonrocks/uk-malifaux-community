# Generated by Django 5.1.4 on 2024-12-21 20:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0012_event_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='level',
            field=models.CharField(choices=[('MASTERS', 'Masters'), ('GT', 'GT'), ('STANDARD', 'Standard')], default='STANDARD', max_length=200),
            preserve_default=False,
        ),
    ]
