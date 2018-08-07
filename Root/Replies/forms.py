from django import forms

class ContactForm(forms.Form):
    firstName = forms.CharField(required=True)
    lastName = forms.CharField(required=True)
    mobile = forms.CharField(required=True)
    email = forms.EmailField(required=True)
    contactAdress = forms.CharField(
        required=True,
        widget=forms.Textarea
    )

class SearchForm(forms.Form):
    CHOICES = (
                ('1', 'First Name',),
                ('2', 'Last Name',),
                ('3', 'Mobile',),
                ('4', 'Email',),
                ('5', 'Contact Adress',)
    )
    searchCategory = forms.ChoiceField(choices=CHOICES)
    searchString = forms.CharField(required=True)