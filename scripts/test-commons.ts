import { SkinCondition } from "../src/enums";
import { parseCommons, type CommonsResponse } from "../src/server/commons";

// Dữ liệu mẫu mô phỏng cấu trúc trả về của MediaWiki API (không gọi mạng)
const meta = (license: string, artist: string) => ({ LicenseShortName: { value: license }, Artist: { value: artist } });
const page = (id: number, title: string, mime: string, width: number, license: string, artist = "<a href='x'>Tác giả A</a>") => ({
  pageid: id,
  title,
  imageinfo: [{ thumburl: `https://upload.wikimedia.org/${id}.jpg`, thumbwidth: width, descriptionurl: `https://commons.wikimedia.org/wiki/${id}`, mime, extmetadata: meta(license, artist) }],
});

const fixture: CommonsResponse = {
  query: {
    pages: {
      "1": page(1, "File:Acne face.jpg", "image/jpeg", 800, "CC BY-SA 4.0"),
      "2": page(2, "File:Acne NC.jpg", "image/jpeg", 800, "CC BY-NC 2.0"),
      "3": page(3, "File:Acne ND.jpg", "image/jpeg", 800, "CC BY-ND 2.0"),
      "4": page(4, "File:Acne diagram.jpg", "image/jpeg", 800, "CC BY 4.0"),
      "5": page(5, "File:Acne small.jpg", "image/jpeg", 200, "CC0"),
      "6": page(6, "File:Acne icon.svg", "image/svg+xml", 800, "CC0"),
      "7": page(7, "File:Acne pd.jpg", "image/jpeg", 800, "Public domain", ""),
      "8": page(8, "File:Acne gfdl.jpg", "image/jpeg", 800, "GFDL"),
    },
  },
};

const result = parseCommons(fixture, SkinCondition.Acne);
const ids = result.map((image) => image.id).sort();
const expected = ["commons-1", "commons-7"];
if (JSON.stringify(ids) !== JSON.stringify(expected)) throw new Error(`Sai: ${ids.join(",")} (kỳ vọng ${expected.join(",")})`);
const first = result.find((image) => image.id === "commons-1");
if (first?.credit !== "Tác giả A") throw new Error(`Credit sai: ${first?.credit}`);
const pd = result.find((image) => image.id === "commons-7");
if (!pd?.credit.includes("Wikimedia")) throw new Error("Thiếu credit mặc định");
console.log("parseCommons OK:", ids.join(", "));
