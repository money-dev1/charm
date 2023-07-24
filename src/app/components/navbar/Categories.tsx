'use client'

import Container from '../Container'

import { usePathname, useSearchParams } from 'next/navigation'
import { TbBeach } from 'react-icons/tb'
import CategoryBox from '../CategoryBox'

export const categories = [
  {
    label: 'Money',
    icon: TbBeach,
    description: 'This property is close to the beach!',
  },
  {
    label: 'Luck',
    icon: TbBeach,
    description: 'This property is close to the beach!',
  },
]
const Categories = () => {
  const params = useSearchParams()
  const category = params?.get('category')
  const pathname = usePathname()

  const isMainPage = pathname === '/'

  if (!isMainPage) {
    return null
  }
  return (
    <Container>
      <div
        className="
            flex
            flex-row
            items-center
            justify-around
            overflow-x-auto
            pt-4
            "
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  )
}

export default Categories
