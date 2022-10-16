import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Text,
  VStack,
  Button,
  Skeleton,
  CheckboxGroup,
  Badge,
  Stack
} from "@chakra-ui/react";
import ProductsGrid from "../Components/Products/ProductsGrid";
import ProductsBreadCrumb from "../Components/Products/ProductsBreadCrum";
import Tabs from "../Components/Navbar/Tabs";
import { FiTrash2 } from "react-icons/fi";
import { CloseIcon } from "@chakra-ui/icons";


function Products() {
  const getCurrPage = (value) => {
    value = Number(value);

    if (value <= 0) {
      value = 1;
    }
    if (!value) {
      value = 1;
    }

    return value;
  };
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(false);
  const { cat } = useParams();
  const newCat = cat.split("-");
  const catSplit = newCat.join(" ");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [orderBy, setOrderBy] = useState(search.get("orderBy") || "");
  const arr = [];
  const [page, setPage] = useState(getCurrPage(search.get("page")) || 1);
  
  const [filterArr, setFilterArr] = useState([]);

  const [filters, setFilters] = useState([
    {
      id: 1,
      checked: false,
      label: "Dettol",
    },
    {
      id: 2,
      checked: false,
      label: "Savlon",
    },
    {
      id: 3,
      checked: false,
      label: "PharmEasy",
    },
    {
      id: 4,
      checked: false,
      label: "Revital",
    },
    {
      id: 5,
      checked: false,
      label: "EverHerb",
    },
  ]);

  // console.log(filterArr);
  // console.log(search);
  let p1 = `&_sort=newPrice&_order=${orderBy}`;
  if(orderBy==="offer"){
    p1 = `&_sort=offer&_order=desc` 
  }

//  console.log(filters);
  function handleCheckedState(id){
    setFilters([...filters.map(el=>(el.id === id ? {...el,checked:!el.checked}:el))])
    
  }
  
  
  
  useEffect(() => {
    
    let p3 = [...filterArr.map(el=>(`&company=${el.toUpperCase()}`))]
    console.log(p3.join(""))
    setLoading(true);
    axios
      .get(
        `http://localhost:3001/Products?_page=${page}&_limit=9${orderBy && p1}${p3.length>0 ? p3.join("") : ""}`
      )
      .then((res) => {
        // console.log(res);
        setProducts(res.data);
        setTotalPages(Math.ceil(res.headers["x-total-count"] / 9));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [page, orderBy,filterArr]);
  if (page > totalPages) {
    setPage(totalPages);
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    let paramObj = { page };
    if (orderBy) {
      paramObj.orderBy = orderBy;
    }
    const arr =[];
    filters.forEach(el=>{
          
      if(el.checked===true){
        arr.push(el.label)
      }
      
    } )
    setFilterArr(arr);
    // console.log(arr);
      if(filters.find(el=>el.checked===true)){
        paramObj.brand = arr

      } 
    setSearch(paramObj);
    
  }, [page, orderBy, filters]);

  for (let i = 0; i < totalPages; i++) arr[i] = i + 1;
  
  return (
    <>
      <Tabs />
      <Box
        w={{ base: "90%", sm: "90%", lg: "90%", xl: "80%" }}
        margin="80px auto"
        color={"rgba(0,0,0,0.7)"}
      >
        <ProductsBreadCrumb cat={catSplit} />
        <Flex mt={10} justifyContent="space-between">
          <Box display={{ base: "none", xl: "block" }} width="250px">
            <VStack alignItems="start" width="100%">
              <Text fontSize="26px" fontWeight="600" mb="40px">
                Filter
              </Text>
              <Box width="100%">
                <Text fontSize={"16px"} fontWeight="700" mb="26px">
                  Category
                </Text>
                <HStack mb="26px" width={"100%"} justify="space-between">
                  <Text fontSize={"14px"} fontWeight="400">
                    {catSplit}
                  </Text>
                  <Radio isChecked={true} colorScheme="teal"></Radio>
                </HStack>
              </Box>
              <hr></hr>

              
              {loading && (
                <Stack>
                  <Skeleton mt={"20px"} mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                </Stack>
              )}
              {loading === false && (
                <Box width="100%">
                  <Text
                    fontSize={"16px"}
                    fontWeight="700"
                    mb="20px"
                    mt={"20px"}
                  >
                    Sub Category
                  </Text>
                  <RadioGroup   defaultValue="2">
                    <HStack mb="26px" width={"100%"} justify="space-between">
                      <Text fontSize={"14px"} fontWeight="400">
                        Nutritional Drinks
                      </Text>
                      <Radio borderColor={"grey"}  value={"1"}  colorScheme="teal" ></Radio>
                    </HStack>
                    <HStack mb="26px" width={"100%"} justify="space-between">
                      <Text fontSize={"14px"} fontWeight="400">
                        Health Food
                      </Text>
                      <Radio borderColor={"grey"} value={"2"} colorScheme="teal"></Radio>
                    </HStack>
                    <HStack mb="26px" width={"100%"} justify="space-between">
                      <Text fontSize={"14px"} fontWeight="400">
                        Diabetic Care
                      </Text>
                      <Radio borderColor={"grey"} value={"3"} colorScheme="teal"></Radio>
                    </HStack>
                    <HStack mb="26px" width={"100%"} justify="space-between">
                      <Text fontSize={"14px"} fontWeight="400">
                        Beverages
                      </Text>
                      <Radio borderColor={"grey"} value={"4"} colorScheme="teal"></Radio>
                    </HStack>
                    <HStack mb="26px" width={"100%"} justify="space-between">
                      <Text fontSize={"14px"} fontWeight="400">
                        Weight Management
                      </Text>
                      <Radio borderColor={"grey"} value={"5"} colorScheme="teal"></Radio>
                    </HStack>
                  </RadioGroup>
                </Box>
              )}

              <Divider />
              {loading && (
                <Stack>
                  <Skeleton mt={"20px"} mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                  <Skeleton mb={"20px"} height={"20px"} />
                </Stack>
              )}
              {loading === false && (
                <Box width="100%">
                  <Text
                    fontSize={"16px"}
                    fontWeight="700"
                    mb="20px"
                    mt={"20px"}
                  >
                    Brand
                  </Text>
                  
                    <VStack spacing={"20px"} width={"100%"}>
                      {filters.map((el) => (
                        <HStack  key={el.id} width={"100%"} justify="space-between">
                          <Text fontSize={"14px"} fontWeight="400">
                            {el.label}
                          </Text>{" "}
                          <Checkbox
                          onChange={()=>handleCheckedState(el.id)}
                            border={"grey"}
                            colorScheme="teal"
                            value={el.label}
                            isChecked={el.checked}
                          ></Checkbox>
                        </HStack>
                      ))}
                    </VStack>
                  
                </Box>
              )}
            </VStack>
          </Box>
          <Box flexGrow={1} ml={{ xl: "50px" }}>
            <HStack
              flexWrap={"wrap"}
              justifyContent={{
                base: "center",
                sm: "space-between",
                lg: "space-between",
                xl: "space-between",
              }}
              alignItems={"center"}
              mb="40px"
            >
              <Box>
                <Text fontSize="26px" fontWeight="600">
                  {catSplit}
                </Text>
              </Box>
              <HStack>
                <Text noOfLines={1}>Sort By:</Text>
                <Box>
                  <Select
                  colorScheme={"teal"}
                    value={orderBy}
                    onChange={(e) => {
                      setOrderBy(e.target.value);
                    }}
                    placeholder="Popularity"
                  >
                    <option value="asc">Price low to high </option>
                    <option value="desc">Price high to low </option>
                    <option value="offer">Discount</option>
                  </Select>
                </Box>
              </HStack>
            </HStack>
            {filterArr.length>0 && <HStack mb="20px"><Text fontSize={"12px"} >Applied Filters :</Text>{
              filters.map(e=>{
                if(e.checked){
                  return <Button   mr={"10px"}  size={"xs"} rightIcon={<CloseIcon onClick={(()=>handleCheckedState(e.id))} fontSize={"8px"}/>} variant={"outline"} colorScheme={"teal"}>{e.label}</Button>
                }
              })
            }</HStack>}
            <ProductsGrid data={products} loading={loading} />
            {loading && (
              <Skeleton>
                <HStack
                  width={"fit-content"}
                  mt={"50px"}
                  justify="center"
                  spacing={"30px"}
                >
                  {arr.map((el) => (
                    <Button
                      colorScheme={"teal"}
                      onClick={() => setPage(el)}
                      disabled={page === el}
                      key={el}
                    >
                      {el}
                    </Button>
                  ))}
                </HStack>
              </Skeleton>
            )}
            {loading === false && (
              <HStack mt={"50px"} justify="center" spacing={"20px"}>
                {arr.map((el) => (
                  <Button
                  variant={"outline"}
                    colorScheme={"teal"}
                    onClick={() => setPage(el)}
                    disabled={page === el}
                    key={el}
                  >
                    {el}
                  </Button>
                ))}
              </HStack>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default Products;
