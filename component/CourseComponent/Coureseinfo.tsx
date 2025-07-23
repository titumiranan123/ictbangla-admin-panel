import { RootState } from "@/redux/store";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTrash, FaChevronDown } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { setInfo } from "@/redux/features/courseSlice";

interface IInfo {
  faq: { question: string; answer: string }[];
  requirement: {
    category: "point" | "paragraph" | "question";
    question?: { question: string; answer?: string }[];
    point?: string[];
    paragraph?: string;
  };
  outcomes: {
    category: "point" | "paragraph" | "question";
    question?: { question: string; answer?: string }[];
    point?: string[];
    paragraph?: string;
  };
}

const CourseInfo = ({ setActiveTab }: { setActiveTab: (label: string) => void }) => {
  const info = useSelector((state: RootState) => state.course.info);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors, isDirty, isValid },
    control,
    setValue,
    register,
    watch,
    reset,
  } = useForm<IInfo>({
    defaultValues: info,
    mode: "onChange",
  });

  // Field arrays for dynamic fields
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faq",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "requirement.question",
  });

  const {
    fields: outQuestionFields,
    append: OutAppendQuestion,
    remove: OutRemoveQuestion,
  } = useFieldArray({
    control,
    name: "outcomes.question",
  });

  // Watched values
  const points = watch("requirement.point") || [];
  const outcomePoints = watch("outcomes.point") || [];
  const requirementCategory = watch("requirement.category");
  const outComeCategory = watch("outcomes.category");

  const onSubmit = (data: IInfo) => {
    dispatch(setInfo(data));
    setActiveTab("Pricing");
  };

  const handleRequirementCategoryChange = (
    newCategory: "point" | "paragraph" | "question"
  ) => {
    // Get current form values
    const currentValues = watch();
    
    // Create new requirement object based on selected category
    let newRequirement: any = { category: newCategory };
    
    if (newCategory === "question") {
      newRequirement.question = currentValues.requirement?.question?.length 
        ? [...currentValues.requirement.question] 
        : [{ question: "", answer: "" }];
    } else if (newCategory === "point") {
      newRequirement.point = currentValues.requirement?.point?.length 
        ? [...currentValues.requirement.point] 
        : [""];
    } else if (newCategory === "paragraph") {
      newRequirement.paragraph = currentValues.requirement?.paragraph || "";
    }
    
    // Preserve other fields while updating requirement
    reset({
      ...currentValues,
      requirement: newRequirement
    });
  };

  const handleOutcomesCategoryChange = (
    newCategory: "point" | "paragraph" | "question"
  ) => {
    // Get current form values
    const currentValues = watch();
    
    // Create new outcomes object based on selected category
    let newOutcomes: any = { category: newCategory };
    
    if (newCategory === "question") {
      newOutcomes.question = currentValues.outcomes?.question?.length 
        ? [...currentValues.outcomes.question] 
        : [{ question: "", answer: "" }];
    } else if (newCategory === "point") {
      newOutcomes.point = currentValues.outcomes?.point?.length 
        ? [...currentValues.outcomes.point] 
        : [""];
    } else if (newCategory === "paragraph") {
      newOutcomes.paragraph = currentValues.outcomes?.paragraph || "";
    }
    
    // Preserve other fields while updating outcomes
    reset({
      ...currentValues,
      outcomes: newOutcomes
    });
  };

  return (
    <div className="min-h-screen  pb-20">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
        {/* FAQ Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-sm">Add common questions students might have about your course</p>
            </div>
            <button
              type="button"
              onClick={() => appendFaq({ question: "", answer: "" })}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm self-start md:self-center"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add FAQ
            </button>
          </div>

          {faqFields.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
              <p>No FAQs added yet</p>
              <button
                type="button"
                onClick={() => appendFaq({ question: "", answer: "" })}
                className="mt-2 text-green-600 hover:text-green-700 font-medium"
              >
                Click to add your first FAQ
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {faqFields.map((field, index) => (
                <div key={field.id} className="p-5 border border-gray-200 rounded-lg hover:border-green-200 transition-colors bg-gray-50/50 group relative">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label="Remove FAQ"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        {...register(`faq.${index}.question`, { required: "Question is required" })}
                        type="text"
                        placeholder="e.g., What prerequisites are needed for this course?"
                        className={`w-full p-2.5 border ${errors.faq?.[index]?.question ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      />
                      {errors.faq?.[index]?.question && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" />
                          {errors.faq[index]?.question?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        {...register(`faq.${index}.answer`, { required: "Answer is required" })}
                        placeholder="Provide a clear and concise answer"
                        rows={4}
                        className={`w-full p-2.5 border ${errors.faq?.[index]?.answer ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      />
                      {errors.faq?.[index]?.answer && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" />
                          {errors.faq[index]?.answer?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requirement Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Course Requirements</h2>
            <p className="text-gray-500 text-sm">Specify what students should know or have before taking this course</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Format</label>
              <div className="relative">
                <select
                  value={requirementCategory}
                  onChange={(e) => handleRequirementCategoryChange(e.target.value as "point" | "paragraph" | "question")}
                  className="appearance-none w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50"
                >
                  <option value="point">Bullet Points</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="question">Q&A Format</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {requirementCategory === "question" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">Questions & Answers</h3>
                    <button
                      type="button"
                      onClick={() => appendQuestion({ question: "", answer: "" })}
                      className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                    >
                      <FaPlus className="w-3 h-3 mr-1" />
                      Add Question
                    </button>
                  </div>

                  {questionFields.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                      <p>No questions added yet</p>
                      <button
                        type="button"
                        onClick={() => appendQuestion({ question: "", answer: "" })}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Add your first question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questionFields.map((field, index) => (
                        <div key={field.id} className="p-5 border border-gray-200 rounded-lg hover:border-green-200 transition-colors bg-gray-50/50 relative">
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            aria-label="Remove question"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                              <input
                                {...register(`requirement.question.${index}.question`, { required: "Question is required" })}
                                type="text"
                                placeholder="e.g., Do I need prior experience?"
                                className={`w-full p-2.5 border ${errors.requirement?.question?.[index]?.question ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                              />
                              {errors.requirement?.question?.[index]?.question && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <FiAlertCircle className="mr-1" />
                                  {errors.requirement.question[index]?.question?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                              <textarea
                                {...register(`requirement.question.${index}.answer`, { required: "Answer is required" })}
                                placeholder="Provide a helpful answer"
                                rows={4}
                                className={`w-full p-2.5 border ${errors.requirement?.question?.[index]?.answer ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                              />
                              {errors.requirement?.question?.[index]?.answer && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <FiAlertCircle className="mr-1" />
                                  {errors.requirement.question[index]?.answer?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {requirementCategory === "point" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Key Requirements</h3>
                  {points.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                      <p>No requirements added yet</p>
                      <button
                        type="button"
                        onClick={() => setValue("requirement.point", [...points, ""])}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Add your first requirement
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {points.map((_, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                          <span className="mt-3.5 w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></span>
                          <div className="flex-1">
                            <div>
                              <input
                                {...register(`requirement.point.${index}`, { required: "Requirement cannot be empty" })}
                                type="text"
                                placeholder="e.g., Basic understanding of JavaScript"
                                className={`w-full p-2.5 border ${errors.requirement?.point?.[index] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                              />
                              {errors.requirement?.point?.[index] && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <FiAlertCircle className="mr-1" />
                                  {errors.requirement.point[index]?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setValue("requirement.point", points.filter((_, i) => i !== index))}
                            className="mt-3.5 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            aria-label="Remove requirement"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setValue("requirement.point", [...points, ""])}
                    className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm mt-2"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add Another Requirement
                  </button>
                </div>
              )}

              {requirementCategory === "paragraph" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Detailed Requirements</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements Description</label>
                    <textarea
                      {...register("requirement.paragraph", { required: "Description is required" })}
                      placeholder="Describe in detail what students should know or have before taking this course"
                      rows={6}
                      className={`w-full p-2.5 border ${errors.requirement?.paragraph ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.requirement?.paragraph && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" />
                        {errors.requirement.paragraph.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Outcomes Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Learning Outcomes</h2>
            <p className="text-gray-500 text-sm">What will students learn or be able to do after completing this course?</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes Format</label>
              <div className="relative">
                <select
                  value={outComeCategory}
                  onChange={(e) => handleOutcomesCategoryChange(e.target.value as "point" | "paragraph" | "question")}
                  className="appearance-none w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50"
                >
                  <option value="point">Bullet Points</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="question">Q&A Format</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {outComeCategory === "question" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">Outcome Questions</h3>
                    <button
                      type="button"
                      onClick={() => OutAppendQuestion({ question: "", answer: "" })}
                      className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                    >
                      <FaPlus className="w-3 h-3 mr-1" />
                      Add Question
                    </button>
                  </div>

                  {outQuestionFields.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                      <p>No outcome questions added yet</p>
                      <button
                        type="button"
                        onClick={() => OutAppendQuestion({ question: "", answer: "" })}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Add your first question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {outQuestionFields.map((field, index) => (
                        <div key={field.id} className="p-5 border border-gray-200 rounded-lg hover:border-green-200 transition-colors bg-gray-50/50 relative">
                          <button
                            type="button"
                            onClick={() => OutRemoveQuestion(index)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            aria-label="Remove question"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                              <input
                                {...register(`outcomes.question.${index}.question`, { required: "Question is required" })}
                                type="text"
                                placeholder="e.g., What will I be able to build after this course?"
                                className={`w-full p-2.5 border ${errors.outcomes?.question?.[index]?.question ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                              />
                              {errors.outcomes?.question?.[index]?.question && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <FiAlertCircle className="mr-1" />
                                  {errors.outcomes.question[index]?.question?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                              <textarea
                                {...register(`outcomes.question.${index}.answer`, { required: "Answer is required" })}
                                placeholder="Describe the learning outcome"
                                rows={4}
                                className={`w-full p-2.5 border ${errors.outcomes?.question?.[index]?.answer ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                              />
                              {errors.outcomes?.question?.[index]?.answer && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <FiAlertCircle className="mr-1" />
                                  {errors.outcomes.question[index]?.answer?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {outComeCategory === "point" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Key Outcomes</h3>
                  {outcomePoints.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                      <p>No outcomes added yet</p>
                      <button
                        type="button"
                        onClick={() => setValue("outcomes.point", [...outcomePoints, ""])}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Add your first outcome
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {outcomePoints.map((_, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                          <span className="mt-3.5 text-green-500">✓</span>
                          <div className="flex-1">
                            <div>
                              <input
                                {...register(`outcomes.point.${index}`, { required: "Outcome cannot be empty" })}
                                type="text"
                                placeholder="e.g., Build a complete React application"
                                className={`w-full p-2.5 border ${errors.outcomes?.point?.[index] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                              />
                              {errors.outcomes?.point?.[index] && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <FiAlertCircle className="mr-1" />
                                  {errors.outcomes.point[index]?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setValue("outcomes.point", outcomePoints.filter((_, i) => i !== index))}
                            className="mt-3.5 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            aria-label="Remove outcome"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setValue("outcomes.point", [...outcomePoints, ""])}
                    className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm mt-2"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add Another Outcome
                  </button>
                </div>
              )}

              {outComeCategory === "paragraph" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Detailed Outcomes</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes</label>
                    <textarea
                      {...register("outcomes.paragraph", { required: "Description is required" })}
                      placeholder="Describe in detail what students will learn or be able to accomplish"
                      rows={6}
                      className={`w-full p-2.5 border ${errors.outcomes?.paragraph ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.outcomes?.paragraph && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" />
                        {errors.outcomes.paragraph.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 shadow-sm">
          <div className="flex justify-end max-w-4xl mx-auto px-4">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className={`px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-md ${
                !isDirty || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Save & Continue to Pricing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseInfo;