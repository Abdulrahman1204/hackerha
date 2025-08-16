import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import {
  Bank,
  validateCreateBank,
  validateUpdateBank,
} from "../../models/banks/Bank.model";
import { IBanks } from "../../models/banks/dtos";
import { ICloudinaryFile } from "../../utils/types";

class CtrlBanksService {
  // ~ Get => /api/hackit/ctrl/banks ~ Get All Banks
  static async getAllBanks(queryParams: { name?: string; year?: number }) {
    const { name, year } = queryParams;

    const filter: any = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (year) filter.year = year;

    const banks = await Bank.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");
    return banks;
  }

  // ~ Get => /api/hackit/ctrl/banks/:id ~ Get Single Bank
  static async getSingleBank(id: string) {
    const bank = await Bank.findById(id);
    if (!bank) {
      throw new NotFoundError("البنك غير موجود");
    }
    return bank;
  }

  // ~ Post => /api/hackit/ctrl/banks ~ Create New Bank
  static async createNewBank(bankData: IBanks, file: ICloudinaryFile) {
    const { error } = validateCreateBank(bankData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!file) {
      throw new BadRequestError("صورة البنك مطلوبة");
    }

    const newBank = await Bank.create({
      ...bankData,
      image: file.path,
    });

    if (!newBank) throw new NotFoundError("فشل إنشاء البنك");

    return { message: "تم إنشاء البنك بنجاح" };
  }

  // ~ Put => /api/hackit/ctrl/banks/:id ~ Update Bank
  static async updateBank(bankData: Partial<IBanks>, id: string) {
    const { error } = validateUpdateBank(bankData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const bankHave = await Bank.findById(id);
    if (!bankHave) {
      throw new NotFoundError("البنك غير موجود");
    }

    const updatedBank = await Bank.findByIdAndUpdate(id, bankData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBank) {
      throw new NotFoundError("فشل في تحديث البنك");
    }

    return { message: "تم تحديث البنك بنجاح" };
  }

  // ~ Delete => /api/hackit/ctrl/banks/:id ~ Delete Bank
  static async deleteBank(id: string) {
    const deletedBank = await Bank.findByIdAndDelete(id);
    if (!deletedBank) {
      throw new NotFoundError("البنك غير موجود");
    }
    return { message: "تم حذف البنك بنجاح" };
  }

  // ~ put => /api/hackit/ctrl/bank/:id/image ~ Update Image Bank
  static async updateImageBank(id: string, file: ICloudinaryFile) {
    const bank = await Bank.findById(id);

    if (!bank) {
      throw new NotFoundError("البنك غير موجود");
    }

    if (!file) {
      throw new BadRequestError("الصورة مطلوبة");
    }

    console.log(file.path)

    const updatedBank = await Bank.findByIdAndUpdate(
      id,
      {
        $set: {
          image: file.path,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedBank) throw new NotFoundError("فشل تحديث صورة البنك");

    return { message: "تم تحديث صورة البنك بنجاح" };
  }
}

export { CtrlBanksService };
