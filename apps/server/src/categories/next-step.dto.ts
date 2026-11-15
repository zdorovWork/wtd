import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

const ANSWERS = ["yes", "probably", "dontKnow", "probablyNot", "no"] as const;

export class GivenAnswerDto {
  @IsString()
  questionId!: string;

  @IsIn(ANSWERS)
  answer!: (typeof ANSWERS)[number];
}

export class NextStepBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GivenAnswerDto)
  answers!: GivenAnswerDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  rejectedAtCount?: number;
}
