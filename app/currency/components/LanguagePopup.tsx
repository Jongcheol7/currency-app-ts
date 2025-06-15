import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useLangueStore } from "../hooks/useLangueStore";
import { useState } from "react";

type Props = {
  setIsLanPopShow: (value: boolean) => void;
};
export default function LanguegePopup({ setIsLanPopShow }: Props) {
  const { language, setLanguage } = useLangueStore();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  //console.log("zustand langauge : ", language);

  const handleConfirm = () => {
    setLanguage(selectedLanguage);
    setIsLanPopShow(false);
  };

  return (
    <div>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white z-50 px-5 py-7 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 justify-between">
          <h1 className="text-xl font-bold">Select Languege</h1>
          <Button className="py-0 px-2" onClick={handleConfirm}>
            확인
          </Button>
        </div>

        <RadioGroup
          value={selectedLanguage}
          onValueChange={(value) => setSelectedLanguage(value)}
          className="space-y-3 mt-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="ko"
              id="ko"
              className="w-4 h-4 rounded-full border border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label htmlFor="ko">Korean</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="en"
              id="en"
              className="w-4 h-4 rounded-full border border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label htmlFor="en">English</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="ja"
              id="ja"
              className="w-4 h-4 rounded-full border border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label htmlFor="ja">Japanese</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="zh"
              id="zh"
              className="w-4 h-4 rounded-full border border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label htmlFor="zh">Chinese</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="es"
              id="es"
              className="w-4 h-4 rounded-full border border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label htmlFor="es">Spanish</label>
          </div>
        </RadioGroup>
      </div>

      <div
        className="fixed inset-0 bg-black/60 z-20"
        onClick={() => setIsLanPopShow(false)}
      />
    </div>
  );
}
