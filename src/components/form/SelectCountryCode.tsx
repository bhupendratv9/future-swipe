import {Select} from "@base-ui/react";
import ChevronBottomIconSvg from "@/components/svgs/icons/ChevronBottomIconSVG.tsx";

type selectCountryCodeProps = {
  countryCode: string | null;
  setCountryCode: (countryCode: string | null) => void;
  countryCodes: { value: string; label: string }[];
};

export default function SelectCountryCode({countryCode, setCountryCode, countryCodes}: selectCountryCodeProps) {
  return (<Select.Root
    value={countryCode}
    onValueChange={setCountryCode}
    items={countryCodes}
  >
    <Select.Trigger className="flex gap-2.5 bg-white/20 p-2.5 rounded-[10px]">
      <Select.Value className={"w-7.5"}/>
      <Select.Icon>
        <ChevronBottomIconSvg/>
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Positioner className="z-50" sideOffset={0}>
        <Select.Popup className="rounded-[10px]  bg-[#333] w-22">
          <Select.List className="p-1">
            {countryCodes.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="relative flex w-full text-white p-2.5 font-montserrat hover:bg-white/40 rounded-[10px]"
              >
                <Select.ItemText>
                  {item.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>)
}
