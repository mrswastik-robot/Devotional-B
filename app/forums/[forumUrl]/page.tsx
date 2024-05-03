import React from 'react';

const ForumsPage = () => {
    return (
        <div>
            <>  
            {/* <Head>
                <title>/r/{subredditQuery?.subredditHandle}</title>
            </Head>

            <div className="bg-white">
                <div className="bg-slate-300 h-56 w-full">

                </div>
                <div className="flex pt-5 pb-7 bg-transparent mx-auto items-center max-w-6xl lg:max-w-7xl xl:max-w-8xl">
                    <div className="relative group">
                        {subredditQuery && <SubredditImage {...subredditQuery} />}
                    </div>
                    <div className="pl-8">
                        {subredditQuery && <SubredditTitle {...subredditQuery}/> }
                        <p className="text-slate-500">r/{subredditQuery?.subredditHandle}</p>
                    </div>
                    <div className="pl-10">
                        {subredditQuery ?
                            memberStatus ? 
                                                            
                                <button onClick={() => {
                                            leaveSubreddit({subredditId: subredditQuery?.id});
                                            setMemberStatus(false)
                                        }
                                    } className="h-2/5 px-8 py-2 font-bold text-blue-500 bg-transparent border border-blue-500 rounded-3xl focus:outline-none hover:bg-red-600 hover:text-white transition-colors duration-300 group">
                                    <span className="group-hover:hidden">
                                        Joined
                                    </span>
                                    <span className="hidden group-hover:inline-block">
                                        Leave
                                    </span>
                                </button>

                                :
                                <button 
                                    className="h-2/5 px-8 py-2 font-bold text-white bg-blue-500 rounded-3xl focus:outline-none hover:bg-blue-600"
                                    onClick={() => {
                                            if ( status == "unauthenticated" ){
                                                signIn().catch(console.log);
                                            }else{
                                                joinSubreddit({subredditId: subredditQuery?.id});
                                                setMemberStatus(true);
                                            }
                                        }
                                    }
                                >
                                    Join
                                </button>

                            :

                            null

                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col pt-5 pb-7 bg-gray-200 mx-auto min-h-screen max-w-6xl lg:max-w-7xl xl:max-w-8xl">
                <div className="flex gap-8">
                    <div className="w-full">
                        <PopularPosts subredditId={subredditQuery?.id}/>
                    </div>

                    <div className="hidden w-1/2 md:block">
                        <CreatePostCreateCommunityCard/>
                    </div>
                </div>
            </div> */}
            Forums Page
        </>
        </div>
    );
}

export default ForumsPage;
