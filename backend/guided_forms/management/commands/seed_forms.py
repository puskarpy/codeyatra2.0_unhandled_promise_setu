from django.core.management.base import BaseCommand
from services.models import Service
from guided_forms.models import FormTemplate, Question


class Command(BaseCommand):
    help = 'Seed the database with sample guided forms and questions'

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed guided forms...')

        # Get or create services
        services_data = [
            {
                'name': 'Citizenship Certificate',
                'description': 'Apply for a citizenship certificate from the government'
            },
            {
                'name': 'Passport Application',
                'description': 'Apply for a new passport or renew your existing passport'
            },
            {
                'name': 'Driving License',
                'description': 'Apply for a driving license in Nepal'
            },
            {
                'name': 'Land Registration',
                'description': 'Register your land property with the government'
            },
        ]

        services = {}
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                name=service_data['name'],
                defaults={'description': service_data['description']}
            )
            services[service_data['name']] = service
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created service: {service.name}'))
            else:
                self.stdout.write(f'Service already exists: {service.name}')

        # Create form templates and questions
        forms_data = [
            {
                'service': 'Citizenship Certificate',
                'name': 'Citizenship Certificate Application Form',
                'description': 'Complete this guided form to apply for a citizenship certificate',
                'questions': [
                    {
                        'text': 'Full Name',
                        'question_type': 'text',
                        'required': True,
                        'order': 1
                    },
                    {
                        'text': 'Date of Birth',
                        'question_type': 'text',
                        'required': True,
                        'order': 2
                    },
                    {
                        'text': 'Citizenship Number (if available)',
                        'question_type': 'text',
                        'required': False,
                        'order': 3
                    },
                    {
                        'text': 'District of Birth',
                        'question_type': 'choice',
                        'required': True,
                        'order': 4,
                        'choices': ['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Kavre', 'Sindhupalchok', 'Nuwakot', 'Rasuwa', 'Dhading', 'Makwanpur', 'Rautahat', 'Bara', 'Parsa', 'Chitwan', 'Gorkha', 'Lamjung', 'Tanahun', 'Syangja', 'Kaski', 'Parbat', 'Baglung', 'Gulmi', 'Palpa', 'Nawalpur', 'Argakhanchi', 'Pyuthan', 'Rolpa', 'Rukum', 'Salyan', 'Dang', 'Banke', 'Bardia', 'Kailali', 'Kanchanpur', 'Sunsari', 'Ilam', 'Jhapa', 'Morang', 'Sankhuwasabha', 'Terhathum', 'Bhojpur', 'Dhankuta', 'Udayapur', 'Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi', 'Rautahat', 'Dolakha', 'Ramechhap', 'Sindhuli', 'Okhaldhunga', 'Khotang', 'Panchthar', 'Taplejung', 'Solukhumbu', 'Mugu', 'Jumla', 'Humla']
                    },
                    {
                        'text': 'Permanent Address',
                        'question_type': 'text',
                        'required': True,
                        'order': 5
                    },
                    {
                        'text': 'Contact Number',
                        'question_type': 'text',
                        'required': True,
                        'order': 6
                    },
                    {
                        'text': 'Email Address',
                        'question_type': 'text',
                        'required': False,
                        'order': 7
                    },
                ]
            },
            {
                'service': 'Passport Application',
                'name': 'Passport Application Form',
                'description': 'Complete this guided form to apply for a new passport or renewal',
                'questions': [
                    {
                        'text': 'Full Name',
                        'question_type': 'text',
                        'required': True,
                        'order': 1
                    },
                    {
                        'text': 'Date of Birth',
                        'question_type': 'text',
                        'required': True,
                        'order': 2
                    },
                    {
                        'text': 'Passport Number (if renewal)',
                        'question_type': 'text',
                        'required': False,
                        'order': 3
                    },
                    {
                        'text': 'Is this a renewal or new application?',
                        'question_type': 'choice',
                        'required': True,
                        'order': 4,
                        'choices': ['New Application', 'Renewal', 'Replacement']
                    },
                    {
                        'text': 'Permanent Address',
                        'question_type': 'text',
                        'required': True,
                        'order': 5
                    },
                    {
                        'text': 'Contact Number',
                        'question_type': 'text',
                        'required': True,
                        'order': 6
                    },
                    {
                        'text': 'Father\'s Name',
                        'question_type': 'text',
                        'required': True,
                        'order': 7
                    },
                    {
                        'text': 'Mother\'s Name',
                        'question_type': 'text',
                        'required': True,
                        'order': 8
                    },
                ]
            },
            {
                'service': 'Driving License',
                'name': 'Driving License Form',
                'description': 'Review and verify your driving license information extracted from your document',
                'questions': [
                    {
                        'text': 'license_number',
                        'question_type': 'text',
                        'required': True,
                        'order': 1
                    },
                    {
                        'text': 'full_name',
                        'question_type': 'text',
                        'required': True,
                        'order': 2
                    },
                    {
                        'text': 'date_of_birth',
                        'question_type': 'text',
                        'required': False,
                        'order': 3
                    },
                    {
                        'text': 'gender',
                        'question_type': 'choice',
                        'required': False,
                        'order': 4,
                        'choices': ['Male', 'Female', 'Other']
                    },
                    {
                        'text': 'license_class',
                        'question_type': 'text',
                        'required': False,
                        'order': 5
                    },
                    {
                        'text': 'issued_date',
                        'question_type': 'text',
                        'required': False,
                        'order': 6
                    },
                    {
                        'text': 'validity_date',
                        'question_type': 'text',
                        'required': False,
                        'order': 7
                    },
                    {
                        'text': 'issuing_authority',
                        'question_type': 'text',
                        'required': False,
                        'order': 8
                    },
                    {
                        'text': 'address',
                        'question_type': 'text',
                        'required': False,
                        'order': 9
                    },
                ]
            },
            {
                'service': 'Land Registration',
                'name': 'Land Registration Form',
                'description': 'Register your land property with the government',
                'questions': [
                    {
                        'text': 'Owner\'s Full Name',
                        'question_type': 'text',
                        'required': True,
                        'order': 1
                    },
                    {
                        'text': 'Property Address',
                        'question_type': 'text',
                        'required': True,
                        'order': 2
                    },
                    {
                        'text': 'Land Area (in sq. meters)',
                        'question_type': 'number',
                        'required': True,
                        'order': 3
                    },
                    {
                        'text': 'District',
                        'question_type': 'choice',
                        'required': True,
                        'order': 4,
                        'choices': ['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Kavre', 'Chitwan', 'Pokhara', 'Dang', 'Other']
                    },
                    {
                        'text': 'Land Type',
                        'question_type': 'choice',
                        'required': True,
                        'order': 5,
                        'choices': ['Residential', 'Agricultural', 'Commercial', 'Mixed Use']
                    },
                    {
                        'text': 'Contact Number',
                        'question_type': 'text',
                        'required': True,
                        'order': 6
                    },
                ]
            }
        ]

        for form_data in forms_data:
            service = services.get(form_data['service'])
            if not service:
                self.stdout.write(self.style.ERROR(f'Service not found: {form_data["service"]}'))
                continue

            form_template, created = FormTemplate.objects.get_or_create(
                name=form_data['name'],
                defaults={
                    'service': service,
                    'description': form_data['description']
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created form template: {form_template.name}'))
            else:
                self.stdout.write(f'Form template already exists: {form_template.name}')

            # Create questions
            for question_data in form_data['questions']:
                question, created = Question.objects.get_or_create(
                    form_template=form_template,
                    text=question_data['text'],
                    defaults={
                        'question_type': question_data['question_type'],
                        'required': question_data['required'],
                        'order': question_data['order'],
                        'choices': question_data.get('choices', None)
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'  Created question: {question.text}'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded guided forms!'))
