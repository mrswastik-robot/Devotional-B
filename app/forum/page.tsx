import Link from "next/link";
import { Suspense } from "react";


const ForumPage = () => {


    return (
        <div>
            Forum Page
        </div>
//         <div className="lg:container lg:max-w-[86rem] lg:mx-auto font-dmsans mt-1">
//         <div className="flex">
//           <div className="max-w-[22.5rem] ">
//         <Sidebar playlists={playlists} selectChange={handleSelectChange} currentC={selectedCategory||"all"} className="hidden lg:block bg-[#ffffff] mr-4 rounded-md" />
//         </div>
//           <div className="bg-background rounded-md pl-[15px]">
//             <div className="">
//               <div className="">
//                 <div className="px-2 py-6 md:w-[63rem] block">
//                   <Tabs defaultValue="Webinar" className="h-full space-y-6">
//                     <div className="space-between flex items-center">
//                       <TabsList>
//                         <TabsTrigger value="Webinar" className="relative" onClick={()=>{
//                           setPosts([]);
//                           setEventModeChange("Webinar");
//                         }}>
//                           Webinar
//                         </TabsTrigger>
//                         {/* <TabsTrigger value="podcasts">Podcasts</TabsTrigger> */}
//                         <TabsTrigger value="Offline" onClick={()=>{
//                           setPosts([]);
//                           setEventModeChange("Offline");
//                         }}>
//                           Offline
//                         </TabsTrigger>
//                       </TabsList>
//                       <div className="ml-auto lg:mr-4">
//                       <div>
//                       <Link
//                       className="hidden lg:inline"
//                     href={"mailto:abhijeetgupta989@gmail.com"}
//                     >
//                         <Button className=" mr-2">
//                           <MailIcon className="mr-2 h-4 w-4" />
//                           Mail To
//                         </Button>
//                       </Link>
//               <Dialog>
//                 {
                  
//                   // <DialogTrigger asChild>
//                     <Link
//                     href={'/events/createEvent'}
//                     >
//                         <Button className="">
//                           <PlusCircleIcon className="hidden lg:block mr-2 h-4 w-4" />
//                           Create Event
//                         </Button>
//                       </Link>
//                   // </DialogTrigger>
//   }
//                   <DialogContent className="sm:max-w-[925px] max-h-[42rem] overflow-y-scroll ">
//                     <DialogHeader>
//                       <DialogTitle>Create your Event</DialogTitle>
//                       <DialogDescription>
//                         Create your Event here. Click submit when you are done.
//                       </DialogDescription>
//                     </DialogHeader>
//                       {/* <Tiptap /> */}
//                      {/* <Textarea className="w-full min-h-[500px]" placeholder="What's your question?" /> */}

//                       <div className=" border border-gray-300 rounded-3xl p-4 cursor-pointer">
//                       <Form {...form}>
//                         <form
//                         className="relative space-y-3 "
//                         onSubmit={form.handleSubmit(onSubmit)}
//                         >

//                           {/* Title */}
//                           <FormField
//                           control={form.control}
//                           name="title"
//                           render = {({field}) => (
//                             <FormItem>
//                               <FormLabel>Title</FormLabel>
//                               <FormControl>
//                                 <Input className="" placeholder="Title for the Event ..." {...field}/>
//                               </FormControl>
//                               <div className="text-[12px] opacity-70">This is the title, write your question here.</div>
//                               <FormMessage/>
//                             </FormItem>
//                           )}
//                           />

//                           {/* EventImage */}
//                           <FormField
//                           control={form.control}
//                           name="eventImageURL"
//                           render = {({field}) => (
//                             <FormItem>
//                               <FormLabel>Event Image</FormLabel>
//                               <FormControl>
                                
//                                 <Input
//                                 type="file"
//                                 onChange={handleImageFileSelect}

//                                 />
//                               </FormControl>
//                               <div className="text-[12px] opacity-70">Upload an image for the Event.</div>
//                               <FormMessage/> 
//                             </FormItem>
//                           )}
//                           />

//                           {/* TipTap Editor */}
//                           <FormField
//                             control={form.control}
//                             name="description"
//                             render = {({field}) => (
//                               <FormItem>
//                                 <FormLabel>Description</FormLabel>
//                                 <div className={`${isFocused?"border-black border-[2.1px]": "border-[1.2px]"} rounded-lg`} onFocus={() => setIsFocused(true)}
//                                   onBlur={() => setIsFocused(false)}
//                                   >
//                                 <FormControl>
//                                   <Controller
//                                     control={form.control}
//                                     name="description"
//                                     render={({ field }) => (
//                                       <Tiptap {...field} setImageUpload={setImageUpload} uploadImage={uploadImage} progress={progress} />
//                                     )}
//                                    /> 
//                                 </FormControl>
//                                 </div>
//                                 <div className="text-[12px] opacity-70">This is the description, give more details about your question here.</div>
//                                 <FormMessage/>
//                               </FormItem>
//                             )}
//                           />
                          
//                           {(progress||0)>0&&<span className='pt-3'>{`${Math.ceil((progress||0))} % Uploaded`}</span>}
//                           {/* "0" to make upload percentage invisible when no image is selected */}
//                           {/* anonymity toggle */}
//                           <div>
//                             {
//                               previewImg&&<div className="w-full flex items-center justify-center">
//                                 <Image src={previewImg} alt="previewImage" width={250} height={250}/>
//                               </div>
//                             }
//                           </div>
//                           {/*Category thing*/}
//                           <div>
                          
//                           <div className="text-sm font-medium mb-2">Category</div>
//                           <Select value={""} onValueChange={handleMainCategoryChange} >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select a Category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectGroup>
//                                 <SelectLabel>Categories</SelectLabel>
//                                 <SelectItem value="How To">How To</SelectItem>
//                                 <SelectItem value="Help">Help</SelectItem>
//                                 <SelectItem value="Mystery|Haunted|Ghost">Mystery/Haunted/Ghost</SelectItem>
//                                 <SelectItem value="Astrology|Remedies|Occult">Astrology/Remedies/Occult</SelectItem>
//                                 <SelectItem value="GemStones|Rudraksha">GemStones/Rudraksha</SelectItem>
//                                 <SelectItem value="Others">Others</SelectItem>
//                               </SelectGroup>
//                             </SelectContent>
//                           </Select>
//                           <div className="flex">
//                               {
//                                 selectC.map((category:string, index:number)=>{
//                                   return <span className='bg-slate-300 text-slate-800 rounded-xl p-1 text-sm flex mr-1 mt-3' key={index}>{category.split("|").join("/")} <span onClick={()=>{delCategories(category)}} className="mt-[0.27rem] ml-1 cursor-pointer text-slate-800 hover:text-slate-900"><LuXCircle /></span></span>
//                                 })
//                               }
//                             </div>
//                             {/* Ls */}
//                             <div className="mt-3">
//                             {selectedMainCategory && (
//                               <Select value={""} onValueChange={handleSubcategoryChange}>
//                                 <SelectTrigger>
//                                 <SelectValue placeholder={`Select subCategory for ${selectedMainCategory.split("|").join("/")}`} />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectGroup>
//                                   <SelectLabel>Sub Categories</SelectLabel>
//                                     {
//                                       subCategoryy.map((subcategory:any, index:any)=>(
//                                         <SelectItem key={index} value={subcategory}>{subcategory}</SelectItem>
//                                       ))
//                                     }
//                                     {/* Add more subcategories for other main categories */}
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             )}
//                             <div className="flex">
//                               {
//                                 tempSubCategory.map((subcategory:string, index:number)=>{
//                                   return <span className='bg-slate-300 text-slate-800 rounded-xl p-1 text-sm flex mr-1 mt-3' key={index}>{subcategory} <span onClick={()=>{delSubCategories(subcategory)}} className="mt-[0.27rem] ml-1 cursor-pointer text-slate-800 hover:text-slate-900"><LuXCircle /></span></span>
//                                 })
//                               }
//                             </div>
//                             </div>
//                             {/* */}
//                             <div className="text-[12px] opacity-70 mt-[0.45rem]">This is the category, you can choose multiple categories for your Question.</div>
//                           </div>
//                           {/* DateOfEvent */}
//                           <FormField
//                               control={form.control}
//                               name="dateOfEvent"
//                               render={({ field }) => (
//                                 <FormItem className="flex flex-col">
//                                   <FormLabel>Date of Event</FormLabel>
//                                   <Popover>
//                                     <PopoverTrigger asChild>
//                                       <FormControl>
//                                         <Button
//                                           variant={"outline"}
//                                           className={cn(
//                                             "w-[240px] pl-3 text-left font-normal",
//                                             !field.value && "text-muted-foreground"
//                                           )}
//                                         >
//                                           {field.value ? (
//                                             format(field.value, "PPP")
//                                           ) : (
//                                             <span>Pick a date</span>
//                                           )}
//                                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                         </Button>
//                                       </FormControl>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0" align="start">
//                                       <Calendar
//                                         mode="single"
//                                         selected={field.value}
//                                         onSelect={field.onChange}
//                                         // disabled={(date) =>
//                                         //   date > new Date() || date < new Date("1900-01-01")
//                                         // }
//                                         initialFocus
//                                       />
//                                     </PopoverContent>
//                                   </Popover>
//                                   {/* <FormDescription>
//                                     This is the date of the event.
//                                   </FormDescription> */}
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                           {/* Location of the Event */}
//                           <FormField
//                           control={form.control}
//                           name="locationOfEvent"
//                           render = {({field}) => (
//                             <FormItem>
//                               <FormLabel>Location of Event</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Location of the Event ..." {...field}/>
//                               </FormControl>
//                               {/* <div className="text-[12px] opacity-70">This is the location of the event.</div> */}
//                               <FormMessage/>
//                             </FormItem>
//                           )}
//                           />

//                           <FormField
//                           control={form.control}
//                           name="durationOfEvent"
//                           render={({field}) => (
//                             <FormItem>
//                               <FormLabel>Duration of the Event</FormLabel>
//                               <FormControl>
//                                 <Input type="number" placeholder="Duration of the Event" {...field}
//                                 min={1}
//                                 max={24}
//                                 onChange={(e) => {
//                                   form.setValue('durationOfEvent', parseInt(e.target.value))
//                                 }}
//                                 />
//                               </FormControl>
//                               {/* <div className="text-[12px] opacity-70">This is the duration of the event.</div> */}
//                               <FormMessage/>
//                             </FormItem>
//                           )}
//                           />

//                           <FormField
//                           control={form.control}
//                           name="registrationLink"
//                           render = {({field}) => (
//                             <FormItem>
//                               <FormLabel>Registration Link</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Registration Link ..." {...field}/>
//                               </FormControl>
//                               {/* <div className="text-[12px] opacity-70">This is the registration link for the event.</div> */}
//                               <FormMessage/>
//                             </FormItem>
//                           )}
//                           />

//                           {/* //spnosors section */}
//                           <FormField
//                           control={form.control}
//                           name="sponsors"
//                           render={({field}) => (
//                             <FormItem>
//                               <FormLabel>Sponsors</FormLabel>
//                               <FormControl>
//                                 <div className=" flex gap-2">
//                                 <Input
//                                   placeholder="Sponsors"
//                                   value={sponsorInput}
//                                   onChange={(e) => setSponsorInput(e.target.value)}
//                                   onKeyPress={(e) => {
//                                     if (e.key === 'Enter') {
//                                       setSponsors((prev) => [...prev, sponsorInput]);
//                                       setSponsorInput('');
//                                     }
//                                   }}
//                                 />
//                                 <Button
//                                 type="button"
//                                 onClick={() => {
//                                   setSponsors((prev) => [...prev, sponsorInput]);
//                                   setSponsorInput('');
//                                 }}
//                                 >Add</Button>
//                                 </div>
//                               </FormControl>

//                              <div className=" flex">
//                               {sponsors.map((sponsor, index) => (
//                                 <div key={index} className=" flex gap-1 p-2 rounded-3xl bg-[#F6F6F7]">
//                                   <p>{sponsor}</p>
//                                   <button type="button" onClick={() => {
//                                     const newSponsors = [...sponsors];
//                                     newSponsors.splice(index, 1);
//                                     setSponsors(newSponsors);
//                                   }}>
//                                     <X/>
//                                   </button>
//                                 </div>
//                               ))}
//                               </div>

//                               <div className="text-[12px] opacity-70">Add sponsors for the event.</div>
//                               <FormMessage/>
//                             </FormItem>
//                           )}
//                           />
                          

//                           <DialogClose asChild>
//                               <Button type="submit" 
//                                 className=" w-full"
//                                 // disabled={isGuest === 'true'}
//                               >
//                                 Post
//                               </Button>
//                           </DialogClose>
                            
                          

//                         </form>
//                       </Form>
//                       </div>

//                       {/* <div>
//                         <input type="file" onChange={(event) => {
//                           if(event.target.files) {
//                             setImageUpload(event.target.files[0]);
//                           }
//                         }}/>
//                         <Button onClick={uploadImage}>Upload Image</Button>
//                         <Progress value={progress} className=" w-[70%]"/>
//                       </div> */}

                    
//                   </DialogContent>
//               </Dialog>
              
//             </div>
//                       </div>
//                     </div>
//                     <TabsContent
//                       value="Webinar"
//                       className="border-none p-0 outline-none"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="space-y-1">
//                           <h2 className="text-xl font-semibold tracking-tight">
//                             Online Events
//                           </h2>
//                           <p className="text-sm text-muted-foreground">
//                           Enrich your spiritual journey through TheGodSays. Ask, seek, answer, and grow.
//                           </p>
//                         </div>
//                       </div>
//                       <Separator className="my-4" />

//                       <div className="flex flex-col">
//                           <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-[1rem] pb-4">
//                             {searchResult && searchResult.length > 0 ?(
//                               searchResult.map((hit: any) => {
//                                 const post = transformHitToPost(hit);
//                                 return (
//                                   <div key={post.id} className="mb-1">
//                                     <AlbumArtwork
//                                       post={post}
//                                     />
//                                   </div>
//                                 );
//                               })
//                             ):(
//                               posts.map((post, index) => (
//                                 <div key={index} className="mb-1 mx-auto md:mx-0">
//                               <AlbumArtwork
//                                 post={post}
//                               />
//                               </div>
//                             ))
                        
//                             )
//                             }

                            
//                           </div>
//                           <div className="mb-5">
//                             <div className='w-[100]'>
//                             { isLoading?<Loader/>:pageLoaded&&
//                             <div ref={loadMoreButtonRef} className='mt-4'>
//                               <button onClick={loadMoreData}></button>
//                             </div>
//                             }
//                             </div>
//                           <div className="w-full text-center mt-0">{!isLoading&&!morePosts&&<div>No more Posts...</div>}</div>
//                           </div>
//                       </div>

//                     </TabsContent>
//                     <TabsContent
//                       value="Offline"
//                       className="h-full flex-col border-none p-0 data-[state=active]:flex"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="space-y-1">
//                           <h2 className="text-xl font-semibold tracking-tight">
//                             Offline Events
//                           </h2>
//                           <p className="text-sm text-muted-foreground">
//                           Enrich your spiritual journey through TheGodSays. Ask, seek, answer, and grow.
//                           </p>
//                         </div>
//                       </div>
//                       <Separator className="my-4" />

//                       <div className="flex flex-col">
//                           <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-[1rem] pb-4">
//                             {searchResult && searchResult.length > 0 ?(
//                               searchResult.map((hit: any) => {
//                                 const post = transformHitToPost(hit);
//                                 return (
//                                   <div key={post.id} className="mb-1">
//                                     <AlbumArtwork
//                                       post={post}
//                                     />
//                                   </div>
//                                 );
//                               })
//                             ):(
//                               posts.map((post, index) => (
//                                 <div key={index} className="mb-1 mx-auto md:mx-0">
//                               <AlbumArtwork
//                                 post={post}
//                               />
//                               </div>
//                             ))
                        
//                             )
//                             }

                            
//                           </div>
//                           <div className="mb-5">
//                             <div className='w-[100]'>
//                             { isLoading?<Loader/>:pageLoaded&&
//                             <div ref={loadMoreButtonRef} className='mt-4'>
//                               <button onClick={loadMoreData}></button>
//                             </div>
//                             }
//                             </div>
//                           <div className="w-full text-center mt-0">{!isLoading&&!morePosts&&<div>No more Posts...</div>}</div>
//                           </div>
//                       </div>
//                     </TabsContent>
//                   </Tabs>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//       </div>
);
}

export default ForumPage;