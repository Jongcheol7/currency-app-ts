import PostRatesButton from "./PostRateButton";

type Props = {
  updatedDate: Date;
};

export default function CurrencyHeader({ updatedDate }: Props) {
  return (
    <div className="flex justify-between mt-2 items-center">
      <p className="font-bold">
        ※ 마지막 갱신 시간 :{" "}
        {new Date(updatedDate).toLocaleString("ko", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24시간제
        })}{" "}
      </p>
      {process.env.NODE_ENV === "development" && <PostRatesButton />}
    </div>
  );
}
