import { Box, Heading, Textarea, Text, Button, Select } from '@chakra-ui/react'
import React, {useState} from 'react'
import { } from 'react-icons/io'
import { AiOutlineClose } from 'react-icons/ai'

export default function PostSettings() {
  const [caption, setCaption] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState([])
  const [addTag, setaddTag] = useState("")
  const [selectedModule, setSelectedModule] = useState("")

  const addNewTag = (event) => {
   if(event.key === "Enter" && addTag !== "" && tag.length < 5){
     setTag([...tag, addTag])
     setaddTag("")
    
  }
  }
console.log(selectedModule)
   const removeTag = (index) => {
    setTag([...tag.filter(tags => tag.indexOf(tags) !== index)])
   }

   const showValue = ( value) => {
    console.log(value)
   }
  return (
    <Box w="100%" h="79vh" mx="auto"  padding={1} display="flex">
      <Box w="90%" h="92%" mx="auto" mt={10} display="flex" justifyContent="space-between">
       
        <Box w="40%" >
        <Heading mb={4}>Details </Heading>
          <Textarea    value={caption} onChange={e =>  setCaption(e.target.value)} border="1px" borderColor="gray.400" 
            placeholder='Post caption' resize="none" maxLength={100} mb={5}
          />

    <Textarea    value={description} onChange={e =>  setDescription(e.target.value)} border="1px" borderColor="gray.400" 
            placeholder='Post description' resize="none" maxLength={100}  h={200}
          />
          <Box border="1px" borderColor="gray.400" borderRadius={4} p={5} mt={3} display="flex" flexWrap="wrap">
            {tag.map((item, i) => {

              return(
                <ul key={i} className="tagList">
                  <li className='tagItem'>{item} {<AiOutlineClose style={{marginLeft : "5px", cursor : "pointer"}}
                  onClick={() => removeTag(i)}
                  />}</li>
                </ul>
              )
            })}
            <input type="text" value={addTag}   className="tags-input"  placeholder='press enter to add tags'
             onKeyUp={event => addNewTag(event)} onChange={e => setaddTag(e.target.value)}
            />
          </Box>
        </Box>
        <Box   w="40%" >
        <Heading mb={4}>Modules </Heading>
          <Select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}
           border="1px" borderColor="gray.400" size="lg"
          >
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
           <option value='freeToCollect'>Option 3</option>
          </Select>
       </Box>
        </Box >
      
    </Box>
  )
}
