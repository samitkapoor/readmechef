export type DropdownProps = {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  optionsHeading: string;
  placeholder: string;
  value: string;
};
