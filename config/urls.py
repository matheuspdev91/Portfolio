from django.urls import path
from django.views.generic import TemplateView


urlpatterns = [
    path("", TemplateView.as_view(template_name="pages/home.html"), name="home"),

     path(
        "sobre/",
        TemplateView.as_view(
            template_name="pages/about.html"
        ),
        name="about",
    ),

    path(
        "servicos/",
        TemplateView.as_view(
            template_name="pages/services.html"
        ),
        name="services",
    ),

    path(
        "projetos/",
        TemplateView.as_view(
            template_name="pages/projects.html"
        ),
        name="projects",
    ),

    path(
        "contato/",
        TemplateView.as_view(
            template_name="pages/contact.html"
        ),
        name="contact",
    ),
]
