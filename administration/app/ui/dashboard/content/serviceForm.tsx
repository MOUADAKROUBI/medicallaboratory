import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { RichTextEditor } from "../../rich-text-editor";

interface ServiceFormProps {
  formData: {
    nom_service: string;
    description: string;
    prix: string;
    image: File | null;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
}

export function ServiceForm({
  formData,
  setFormData,
  onSubmit,
  isEditing = false,
}: Readonly<ServiceFormProps>) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom_service">Nom du Service</Label>
        <Input
          id="nom_service"
          value={formData.nom_service}
          onChange={(e) =>
            setFormData({ ...formData, nom_service: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
      </div>
      <div>
        <Label htmlFor="prix">Prix</Label>
        <Input
          id="prix"
          type="number"
          value={formData.prix}
          onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({
              ...formData,
              image: e.target.files ? e.target.files[0] : null,
            })
          }
        />
      </div>
      <Button type="submit" className="w-full">
        {isEditing ? "Mettre à jour" : "Créer"} Service
      </Button>
    </form>
  );
}
