'use client'

import useUploadModal from '@/app/hooks/useUploadModal'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Heading from '../Heading'
import CategoryInput from '../inputs/CategoryInput'
import ImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/input'
import { categories } from '../navbar/Categories'
import Modal from './Modal'

enum STEPS {
  CATEGORY = 0,
  DESCRIPTION = 1,
  IMAGES = 2,
}

const UploadModal = () => {
  const router = useRouter()
  const uploadModal = useUploadModal()

  const [step, setStep] = useState(STEPS.CATEGORY)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      type: '',
      imageSrc: '',
      title: '',
      description: '',
      tag: '',
    },
  })

  const category = watch('category')
  const imageSrc = watch('imageSrc')

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const onBack = () => {
    setStep((value) => value - 1)
  }

  const onNext = () => {
    setStep((value) => value + 1)
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.IMAGES) return onNext()

    setIsLoading(true)

    axios
      .post('/api/listings', data)
      .then(() => {
        toast.success('Listing Created!')
        router.refresh()
        reset()
        setStep(STEPS.CATEGORY)
        uploadModal.onClose()
      })
      .catch(() => {
        toast.error('Something went wrong')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.IMAGES) {
      return 'Create'
    }

    return 'Next'
  }, [step])

  const secondaryActdionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Back'
  }, [step])

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Select a proper category of your charm"
        subtitle="Pick a category"
      ></Heading>
      <div
        className="
          grid
          max-h-[50vh]
          grid-cols-1
          gap-3
          overflow-y-auto
          md:grid-cols-2"
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            ></CategoryInput>
          </div>
        ))}
      </div>
    </div>
  )

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Input any description" subtitle="" />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={false}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={false}
          required
        />
      </div>
    )
  }
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        ></Heading>
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc', value)}
        />
      </div>
    )
  }

  return (
    <Modal
      title="Upload new charm!"
      isOpen={uploadModal.isOpen}
      onClose={uploadModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActdionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  )
}

export default UploadModal
