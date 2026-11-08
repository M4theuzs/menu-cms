export interface CategoryDto {
  id: string;
  name: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

export interface CategoryFormDto {
  name: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}
