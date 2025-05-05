import React, { useState } from "react";
// button components
import { Button, ButtonText } from "@/components/ui/button";

// form control components
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";

// input components
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

// select components
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// textarea components
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";
import {
  AlertTriangle,
  ChevronDownIcon,
  DollarSign,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

// Import for Cloudinary utils
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary"; // We'll create this
import { addProductToFirestore } from "@/utils/addProductToFirestore"; // You'll need to implement these

import { z } from "zod";
import { ScrollView } from "react-native";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import { Image } from "./ui/image";
import { Alert } from "react-native";

export const AddProductFormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce
    .number()
    .min(1, "Price is required")
    .positive("Price must be positive"),
  image: z.any().optional(), // We'll handle image file separately
});
type AddProductFormDataType = z.infer<typeof AddProductFormDataSchema>;

export default function AddProductForm() {
  const { user } = useAuthStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddProductFormDataType>({
    resolver: zodResolver(AddProductFormDataSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      image: null,
    },
  });

  const handlePickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow media library access");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      const localUri = selectedImage.uri;

      // Set the image URI for preview and form value
      setImagePreview(localUri);
      setValue("image", localUri);
    }
  };

  const onSubmit = async (data: AddProductFormDataType) => {
    setUploading(true);
    try {
      let imageUrl = "";
      if (data.image) {
        try {
          imageUrl = await uploadImageToCloudinary(data.image);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          alert("Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }
      }

      if (!user) {
        alert("You must be logged in to add a product.");
        setUploading(false);
        return;
      }

      await addProductToFirestore({
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        image: imageUrl,
        sellerId: user.uid,
      });

      // Reset form or navigate
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        `Failed to add product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <VStack className="max-w-[440px] p-4 pb-20 px-8 w-full flex flex-col gap-6">
        <Heading size="2xl" className="mt-8 mb-4 text-center">
          Add Product
        </Heading>

        <FormControl isInvalid={!!errors.title}>
          <FormControlLabel>
            <FormControlLabelText>Title</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input>
                <InputField
                  placeholder="Product Title"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>{errors.title?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea>
                <TextareaInput
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </Textarea>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors.description?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isInvalid={!!errors.category}>
          <FormControlLabel>
            <FormControlLabelText>Category</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                selectedValue={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className="w-full flex justify-between"
                  variant="outline"
                  size="md"
                >
                  <SelectInput placeholder="Select Category" />
                  <SelectIcon className="mr-4" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectItem label="Electronics" value="electronics" />
                    <SelectItem label="Clothing" value="clothing" />
                    <SelectItem label="Books" value="books" />
                    <SelectItem label="Home" value="home" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors.category?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isInvalid={!!errors.price}>
          <FormControlLabel>
            <FormControlLabelText>Price</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input>
                <InputSlot className="pl-3">
                  <InputIcon as={DollarSign} />
                </InputSlot>
                <InputField
                  placeholder="Price"
                  keyboardType="numeric"
                  value={String(field.value)}
                  onChangeText={field.onChange}
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>{errors.price?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        <VStack space="md">
          <Button onPress={handlePickImage} variant="outline">
            <ButtonText>
              {imagePreview ? "Change Image" : "Pick Image"}
            </ButtonText>
          </Button>
          {imagePreview && (
            <Image
              source={{ uri: imagePreview }}
              style={{
                borderRadius: 8,
                width: 400,
                margin: "auto",
                aspectRatio: "1/1",
              }}
            />
          )}
        </VStack>

        <Button
          className="w-full bg-primary-500"
          onPress={handleSubmit(onSubmit)}
          isDisabled={uploading}
        >
          <ButtonText className="font-medium text-typography-900">
            {uploading ? "Uploading..." : "Add Product"}
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
