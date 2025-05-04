from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Recipe, Catalog, CatalogRecipe, Favorite, PredefinedCatalogType, PredefinedCatalog, Allergen, \
    UserAllergy, RecipeIngredient


class IngredientQtySerializer(serializers.Serializer):
    name = serializers.CharField(source="ingredient.name")

    class Meta:
        model  = RecipeIngredient
        fields = ("name", "quantity")

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'token')

    def get_token(self, obj):
        refresh = RefreshToken.for_user(obj)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

class RecipeSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    ingredients = IngredientQtySerializer(source="recipe_ingredients", many=True)  # 🔥 override here

    class Meta:
        model  = Recipe
        exclude = ("search_vector",)
        read_only_fields = ("is_favorite",)

    def get_is_favorite(self, obj):
        request = self.context.get("request")
        if not request or not request.user or request.user.is_anonymous:
            return False
        return Favorite.objects.filter(user=request.user, recipe=obj).exists()

class CatalogSerializer(serializers.ModelSerializer):
    recipes = serializers.SerializerMethodField()     # ← was SlimRecipeSerializer(source=...)
    # ingredients = IngredientQtySerializer(source="recipe_ingredients", many=True)
    class Meta:
        model = Catalog
        fields = ("id", "name", "recipes")

    def get_recipes(self, obj):
        # pull the underlying Recipe objects
        qs = [cr.recipe for cr in obj.catalog_recipes.all()]
        return SlimRecipeSerializer(qs, many=True).data


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('recipe',)

class PredefinedCatalogTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedCatalogType
        fields = ('id', 'name')

class PredefinedCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedCatalog
        fields = ('id', 'type', 'name', 'filter_criteria')

class AllergenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergen
        fields = ('id', 'name')

class UserAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAllergy
        fields = ('allergen',)



class SlimRecipeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model  = Recipe
        fields = ("recipe_id", "name", "image")    # ← no internal 'id'

    def get_image(self, obj):
        DEFAULT = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFL5uibOV8chTl50DVzJkzLrOdLXQQL9EoNw&s"
        return obj.images[0] if obj.images else DEFAULT


class CatalogCreateSerializer(serializers.ModelSerializer):
    recipes = SlimRecipeSerializer(many=True, read_only=True)

    class Meta:
        model = Catalog
        fields = ("id", "name", "recipes")

class FavoriteCreateSerializer(serializers.Serializer):
    recipe_id = serializers.IntegerField()