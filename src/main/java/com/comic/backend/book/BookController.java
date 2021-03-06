package com.comic.backend.book;

import com.comic.backend.constant.UrlConstant;
import com.comic.backend.reponse.ResponseEntity;
import com.comic.backend.request.BookRequest;
import com.comic.backend.utils.DataTablePaginationResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import static com.comic.backend.constant.MessageConstant.CREATE_SUCCESS;
import static com.comic.backend.constant.MessageConstant.SUCCESS;
import static com.comic.backend.constant.MessageConstant.SYSTEM_ERROR_MESSAGE;


@CrossOrigin
@RestController
@RequestMapping(value = UrlConstant.BOOK_BASE_URL)
public class BookController {
    private Logger logger = LogManager.getLogger(BookController.class);

    @Autowired
    private BookService bookService;

    @RequestMapping(value = UrlConstant.GET_PAGE_URL, method = RequestMethod.GET)
    public @ResponseBody
    DataTablePaginationResponse getPage(@RequestParam MultiValueMap<String, String> params) {
        logger.info("========== Start getting book page ==========");
        try {
            return bookService.getPage(params);
        } catch (Exception e) {
            return null;
        }
    }

    @RequestMapping(value = UrlConstant.GET_BOOK_DETAIL, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity getBook(@PathVariable("book_id") String bookId) {
        logger.info("========== Start getting book ==========");
        try {
            BookEntity bookEntity = bookService.getBookDetail(Integer.parseInt(bookId));
            if(bookEntity != null) {
                return new ResponseEntity<>(bookEntity);
            }
            return new ResponseEntity<>(false, "Book not Found");
        } catch (Exception e) {
            logger.error(SYSTEM_ERROR_MESSAGE, e);
            return new ResponseEntity<>(false, e.getMessage());
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity createBook(@RequestBody BookRequest bookRequest ) {
        logger.info("========== Start creating book ==========");
        try {
            BookEntity saveBookEntity = bookService.createBook(bookRequest.getBookEntity());
            return new ResponseEntity<>(saveBookEntity);

        } catch (Exception e) {
            logger.error(SYSTEM_ERROR_MESSAGE, e);
            return new ResponseEntity<>(false, e.getMessage());
        }
    }

    @RequestMapping(value = UrlConstant.SOFT_DELETE_BOOK_URL, method = RequestMethod.PUT)
    public @ResponseBody
    ResponseEntity softDeleteBook(@PathVariable("book_id") Integer bookId ) {
        logger.info("========== Start soft  book ==========");
        try {
            BookEntity bookEntity = bookService.getBookDetail(bookId);
            if(bookEntity != null) {
                bookService.softDeleteBook(bookEntity);
                return new ResponseEntity<>(true, "Delete book successfully!");
            }
            return new ResponseEntity<>(false, "Book not Found");
        } catch (Exception e) {
            logger.error(SYSTEM_ERROR_MESSAGE, e);
            return new ResponseEntity<>(false, e.getMessage());
        }
    }

    @RequestMapping(value = UrlConstant.DELETE_CHAPTER_URL, method = RequestMethod.PUT)
    public @ResponseBody
    ResponseEntity deleteChapter(@PathVariable("chapter_id") Integer chapterId ) {
        logger.info("========== Start delete chapter ==========");
        try {
            bookService.deleteChapter(chapterId);
            return new ResponseEntity<>("Delete Chapter Successfully");
        } catch (Exception e) {
            logger.error(SYSTEM_ERROR_MESSAGE, e);
            return new ResponseEntity<>(false, e.getMessage());
        }
    }

    @RequestMapping(method = RequestMethod.PUT)
    public @ResponseBody
    ResponseEntity updateBook(@RequestBody BookRequest bookRequest ) {
        logger.info("========== Start updating book ==========");
        try {
            BookEntity saveBookEntity = bookService.updateBook(bookRequest.getBookEntity());
            if (saveBookEntity != null) {
                return new ResponseEntity<>(saveBookEntity);
            }
            return new ResponseEntity<>(false, "Book not Found");

        } catch (Exception e) {
            logger.error(SYSTEM_ERROR_MESSAGE, e);
            return new ResponseEntity<>(false, e.getMessage());
        }
    }


    @RequestMapping(value = UrlConstant.COPY_BOOK, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity copyBook(@PathVariable("book_id") Integer bookId,
                            @PathVariable("user_id") Integer userId) {
        logger.info("========== Start copying book ==========");
        try {
            BookEntity newBook = bookService.copyBook(bookId, userId);
            if (newBook != null) {
                return new ResponseEntity(true, String.format("Book copy successfully to id %s", newBook.getId()));
            }
            return new ResponseEntity<>(false, "Book not Found");

        } catch (Exception e) {
            logger.error(SYSTEM_ERROR_MESSAGE, e);
            return new ResponseEntity<>(false, e.getMessage());
        }
    }


}
